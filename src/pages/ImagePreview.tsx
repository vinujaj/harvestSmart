import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the navigation type
type RootStackParamList = {
    ImagePreview: { imageUri: string };
    Results: { imageUri: string };
};

type ImagePreviewProps = NativeStackScreenProps<RootStackParamList, 'ImagePreview'>;

const ImagePreview: React.FC<ImagePreviewProps> = ({ route, navigation }) => {
    const { imageUri } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Confirm Image</Text>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => navigation.navigate('Results', { imageUri })}
                >
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 500,
        borderRadius: 16,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    cancelText: {
        color: '#374151',
        fontSize: 16,
    },
    confirmButton: {
        borderRadius: 20,
        backgroundColor: '#34A853',
    },
    confirmText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ImagePreview;
