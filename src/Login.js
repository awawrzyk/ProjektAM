import React, { useState } from 'react';
import {Text,Button, SafeAreaView, StyleSheet, TextInput,View} from 'react-native';



export default Login = ({navigation}) =>{

    const [loggedIn, setLoggedIn] = useState(false)

    const handleLogin=()=>{
        setLoggedIn(true);
        navigation.navigate('Home')
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{'Projekt AM'}</Text>
            <View style={styles.space} />
            <TextInput 
                style={styles.textInput}
                placeholder='Login' />
            <TextInput
                style={styles.textInput}
                placeholder='Hasło' 
                secureTextEntry={true}/>
            <View style={styles.space} />
            <Button
                title='Zaloguj'
                onPress={handleLogin}
                />
           
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title:{
        fontSize: 50,
        textAlign: 'center'
    },
    textInput:{
        fontSize: 20,
        borderColor: 'black',
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    space:{
        marginVertical: 20
    }
 });