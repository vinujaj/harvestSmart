import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { auth, Auth } from '../config/firebase';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';

const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            // The auth state change in UserContext manages navigation.
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/logo1.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={styles.linkButton}
            >
                <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#656565',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#068042',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '70%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: '#068042',
        fontSize: 16,
    },
});

export default Login;