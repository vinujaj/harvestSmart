import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const API_BASE_URL = "http://10.0.2.2:5001";

type DetectionResult = {
    imageUri: string;
    totalBunches: number;
    ripeLevels: {
        ripe: number;
        underripe: number;
        overripe: number;
        abnormal: number;
    };
    timestamp: string;
};

type DailyReport = {
    date: string;
    detections: DetectionResult[];
    totalBunches: number;
    totalRipeLevels: {
        ripe: number;
        underripe: number;
        overripe: number;
        abnormal: number;
    };
};

export function ReportScreen() {
    const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reportSent, setReportSent] = useState(false);

    const loadDailyReport = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const report = await AsyncStorage.getItem(`report_${today}`);
            const sentStatus = await AsyncStorage.getItem(`report_${today}_sent`);
            
            if (report) {
                // Parse the report in chunks to avoid memory issues
                const parsedReport = JSON.parse(report);
                // Limit the number of detections shown to prevent overflow
                if (parsedReport.detections && parsedReport.detections.length > 100) {
                    parsedReport.detections = parsedReport.detections.slice(-100);
                }
                setDailyReport(parsedReport);
                setReportSent(sentStatus === 'true');
            } else {
                setDailyReport(null);
            }
        } catch (error) {
            console.error('Error loading daily report:', error);
            Alert.alert('Error', 'Failed to load daily report. The data might be too large.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDailyReport();
        const interval = setInterval(loadDailyReport, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const generatePDF = async () => {
        if (!dailyReport) return;

        try {
            const html = `
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h1 style="color: #34A853;">Daily Harvest Report</h1>
                        <h2>${new Date().toLocaleDateString()}</h2>
                        
                        <div style="background-color: #E8F5E9; padding: 15px; border-radius: 10px; margin: 10px 0;">
                            <h3>Total Bunches: ${dailyReport.totalBunches}</h3>
                        </div>
                        
                        <h3>Ripeness Levels:</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
                                <strong>Ripe:</strong> ${dailyReport.totalRipeLevels.ripe}
                            </div>
                            <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
                                <strong>Underripe:</strong> ${dailyReport.totalRipeLevels.underripe}
                            </div>
                            <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
                                <strong>Overripe:</strong> ${dailyReport.totalRipeLevels.overripe}
                            </div>
                            <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
                                <strong>Abnormal:</strong> ${dailyReport.totalRipeLevels.abnormal}
                            </div>
                        </div>
                        
                        <h3>Detections:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="background-color: #E8F5E9;">
                                <th style="padding: 10px; text-align: left;">Time</th>
                                <th style="padding: 10px; text-align: right;">Bunches</th>
                            </tr>
                            ${dailyReport.detections.map(d => `
                                <tr style="border-bottom: 1px solid #ddd;">
                                    <td style="padding: 10px;">${new Date(d.timestamp).toLocaleTimeString()}</td>
                                    <td style="padding: 10px; text-align: right;">${d.totalBunches}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </body>
                </html>
            `;

            const options = {
                html,
                fileName: `HarvestReport_${new Date().toISOString().split('T')[0]}`,
                directory: 'Documents',
            };

            const file = await RNHTMLtoPDF.convert(options);
            return file.filePath;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    };

    const sendReportToServer = async () => {
        if (!dailyReport) return;

        try {
            setSubmitting(true);

            // Generate PDF
            const pdfPath = await generatePDF();

            // Create form data
            const formData = new FormData();
            formData.append('date', new Date().toISOString().split('T')[0]);
            formData.append('farmerId', await AsyncStorage.getItem('farmerId') || 'unknown');
            formData.append('reportData', JSON.stringify(dailyReport));
            
            if (pdfPath) {
                formData.append('reportPdf', {
                    uri: `file://${pdfPath}`,
                    type: 'application/pdf',
                    name: 'report.pdf'
                });
            }

            // Send to server
            const response = await axios.post(`${API_BASE_URL}/reports`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setReportSent(true);
                Alert.alert(
                    'Success',
                    'Report sent successfully to collection center',
                    [{ text: 'OK' }]
                );

                // Mark report as sent for today
                const today = new Date().toISOString().split('T')[0];
                await AsyncStorage.setItem(`report_${today}_sent`, 'true');
            }
        } catch (error) {
            console.error('Error sending report:', error);
            Alert.alert(
                'Error',
                'Failed to send report. Please try again later.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const openPDF = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const pdfPath = `${RNFS.DocumentDirectoryPath}/HarvestReport_${today}.pdf`;
            
            // Check if file exists
            const exists = await RNFS.exists(pdfPath);
            if (exists) {
                await Linking.openURL(`file://${pdfPath}`);
            } else {
                Alert.alert('Error', 'PDF file not found');
            }
        } catch (error) {
            console.error('Error opening PDF:', error);
            Alert.alert('Error', 'Could not open PDF file');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading report...</Text>
            </View>
        );
    }

    if (!dailyReport) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Daily Report</Text>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
                </View>
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.noDataText}>No harvesting data for today yet.</Text>
                    <Text style={styles.noDataSubText}>Detection results will appear here after you save them.</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Daily Report</Text>
                <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
            </View>

            {/* Total Bunches Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>TOTAL BUNCHES TODAY</Text>
                <Text style={styles.cardValue}>{dailyReport.totalBunches}</Text>
            </View>

            {/* Ripeness Levels Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>TOTAL RIPENESS LEVELS</Text>
                <View style={styles.grid}>
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>RIPE</Text>
                        <Text style={styles.resultValue}>{dailyReport.totalRipeLevels.ripe}</Text>
                    </View>
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>UNDERRIPE</Text>
                        <Text style={styles.resultValue}>{dailyReport.totalRipeLevels.underripe}</Text>
                    </View>
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>OVERRIPE</Text>
                        <Text style={styles.resultValue}>{dailyReport.totalRipeLevels.overripe}</Text>
                    </View>
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>ABNORMAL</Text>
                        <Text style={styles.resultValue}>{dailyReport.totalRipeLevels.abnormal}</Text>
                    </View>
                </View>
            </View>

            {/* Individual Detections */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>TODAY'S DETECTIONS</Text>
                {dailyReport.detections.map((detection, index) => (
                    <View key={index} style={styles.detectionItem}>
                        <Text style={styles.detectionTime}>
                            {new Date(detection.timestamp).toLocaleTimeString()}
                        </Text>
                        <Text style={styles.detectionBunches}>
                            Bunches: {detection.totalBunches}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Send Report Button */}
            {!reportSent && (
                <TouchableOpacity
                    style={[styles.sendButton, submitting && styles.sendButtonDisabled]}
                    onPress={sendReportToServer}
                    disabled={submitting}
                >
                    <Text style={styles.sendButtonText}>
                        {submitting ? 'SENDING REPORT...' : 'SEND DAILY REPORT'}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Success Message */}
            {reportSent && (
                <View style={styles.successContainer}>
                    <Text style={styles.successText}>✓ Report sent for today</Text>
                    <TouchableOpacity
                        style={styles.viewPdfButton}
                        onPress={openPDF}
                    >
                        <Text style={styles.viewPdfButtonText}>VIEW PDF</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    card: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    cardValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
        width: '100%',
    },
    resultBox: {
        width: '48%',
        marginBottom: 16,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        marginTop: 10,
    },
    noDataText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    noDataSubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    detectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        width: '100%',
    },
    detectionTime: {
        fontSize: 14,
        color: '#666',
    },
    detectionBunches: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: '#34A853',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 28,
        marginTop: 24,
        width: '70%',
        alignSelf: 'center',
        marginBottom: 20,
    },
    sendButtonDisabled: {
        backgroundColor: '#A8D5AE',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    successContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    successText: {
        color: '#34A853',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewPdfButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#34A853',
    },
    viewPdfButtonText: {
        color: '#34A853',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ReportScreen;