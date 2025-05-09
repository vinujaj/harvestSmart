import React, { useState, useEffect } from 'react';
import { RouteProp } from '@react-navigation/core';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

type ResultsScreenProps = {
    route: RouteProp<any, "Results">;
    navigation: NativeStackNavigationProp<any, "Results">;
};

type DetectionResult = {
    imageUri: string;
    totalBunches: number;
    ripeLevels: {
        ripe: number;
        underripe: number;
        overripe: number;
        abnormal: number;
    };
    timestamp?: string;
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

const API_BASE_URL = "http://10.0.2.2:5001";

const saveDetectionResult = async (result: DetectionResult) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const existingReport = await AsyncStorage.getItem(`report_${today}`);
        let dailyReport: DailyReport;
        
        if (existingReport) {
            dailyReport = JSON.parse(existingReport);
            dailyReport.detections.push({
                ...result,
                timestamp: new Date().toISOString()
            });
            dailyReport.totalBunches += result.totalBunches;
            dailyReport.totalRipeLevels.ripe += result.ripeLevels.ripe;
            dailyReport.totalRipeLevels.underripe += result.ripeLevels.underripe;
            dailyReport.totalRipeLevels.overripe += result.ripeLevels.overripe;
            dailyReport.totalRipeLevels.abnormal += result.ripeLevels.abnormal;
        } else {
            dailyReport = {
                date: today,
                detections: [{
                    ...result,
                    timestamp: new Date().toISOString()
                }],
                totalBunches: result.totalBunches,
                totalRipeLevels: { ...result.ripeLevels }
            };
        }

        await AsyncStorage.setItem(`report_${today}`, JSON.stringify(dailyReport));
        return true;
    } catch (error) {
        console.error('Error saving detection:', error);
        return false;
    }
};

export function ResultsScreen({ navigation, route }: ResultsScreenProps) {
    const [results, setResults] = useState<DetectionResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!route.params?.imageUri) {
                Alert.alert("Error", "No image provided!");
                return;
            }

            const formData = new FormData();
            formData.append("image", {
                uri: route.params.imageUri,
                type: "image/jpeg",
                name: "image.jpg",
            });

            try {
                const response = await axios.post(`${API_BASE_URL}/detect`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching results:", error);
                Alert.alert("Error", "Failed to fetch results. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [route.params?.imageUri]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Processing Image...</Text>
            </View>
        );
    }

    if (!results) {
        return <Text style={styles.errorText}>No results found.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton />
            <View style={styles.header}>
                <Text style={styles.headerText}>Results</Text>
            </View>

            {/* Detected Image */}
            <Image
                source={{ 
                    uri: results.imageUri,
                    cache: 'reload'
                }}
                style={styles.detectedImage}
                resizeMode="contain"
            />

            {/* Total Bunches Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>NUMBER OF BUNCHES</Text>
                <Text style={styles.cardValue}>{results.totalBunches}</Text>
            </View>

            {/* Ripeness Levels Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>RIPENESS LEVELS</Text>
                <View style={styles.grid}>
                    {/* Ripe */}
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>RIPE</Text>
                        <Text style={styles.resultValue}>{results.ripeLevels.ripe}</Text>
                    </View>

                    {/* Underripe */}
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>UNDERRIPE</Text>
                        <Text style={styles.resultValue}>{results.ripeLevels.underripe}</Text>
                    </View>

                    {/* Overripe */}
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>OVERRIPE</Text>
                        <Text style={styles.resultValue}>{results.ripeLevels.overripe}</Text>
                    </View>

                    {/* Abnormal */}
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>ABNORMAL</Text>
                        <Text style={styles.resultValue}>{results.ripeLevels.abnormal}</Text>
                    </View>
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={async () => {
                    if (results) {
                        const saved = await saveDetectionResult(results);
                        if (saved) {
                            Alert.alert(
                                "Success",
                                "Results saved successfully!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'MainApp' }]
                                            });
                                        }
                                    }
                                ]
                            );
                        } else {
                            Alert.alert("Error", "Failed to save results");
                        }
                    }
                }}
            >
                <Text style={styles.confirmButtonText}>SAVE</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        padding: 16,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        marginLeft: 48,
        marginTop: 8,
    },
    detectedImage: {
        height: 300,
        marginBottom: 16,
        borderRadius: 8,
        width: '100%',
        backgroundColor: '#f5f5f5',
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
    confirmButton: {
        backgroundColor: '#34A853',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 28,
        marginTop: 24,
        width: '70%',
        alignSelf: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
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
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'red',
        marginTop: 20,
    },
});

export default ResultsScreen;
