import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BackButton from '../components/BackButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [farmerId, setFarmerId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                <Text style={styles.title}>Sign Up</Text>
                
                <View style={styles.form}>
                    <Text style={styles.label}>Full name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={styles.label}>Farmer ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your farmer ID"
                        value={farmerId}
                        onChangeText={setFarmerId}
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainApp')}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 16,
        color: '#34A853',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#34A853',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#34A853',
        paddingVertical: 16, 
        paddingHorizontal: 24, 
        borderRadius: 28,
        marginTop: 24,
        width: '70%', 
        alignSelf: 'center', 
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        color: '#34A853',
    },
    loginLink: {
        color: '#34A853',
        fontWeight: 'bold',
    },
});

export default SignUp;
