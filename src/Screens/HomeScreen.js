import React from 'react';
import {Text,Button, SafeAreaView, StyleSheet, View} from 'react-native';



export default HomeScreen = () =>{
    return(
        <SafeAreaView style={styles.container}>
            <Text>{'Home screen'}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Zlecenia" color='#23A403' />
                <View style={styles.buttonSpacing} />
                <Button title="Klienci" color='#23A403'/>
                <View style={styles.buttonSpacing} />
                <Button title="Asortyment" color='#23A403'/>
                <View style={styles.buttonSpacing} />
                <Button title="Użytkownicy" color='#23A403'/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 5,
    },
    buttonSpacing:{
        marginVertical: 10,
    },
   
});