import React from 'react';
import {Text,Button, SafeAreaView, StyleSheet, View} from 'react-native';



export default HomeScreen = ({navigation}) =>{
    const handleCustomers=()=>{
        navigation.navigate('Customers')
    }
    const handleUsers=() =>{
        navigation.navigate('Users')
    }
    const handleZlecenia=() =>{
        navigation.navigate('Zlecenia')
    }
    const handleProducts=() =>{
        navigation.navigate('Products')
    }
    return(
        <SafeAreaView style={styles.container}>
            <Text>{'Home screen'}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Zlecenia" color='#23A403' onPress={handleZlecenia}/>
                <View style={styles.buttonSpacing} />
                <Button title="Klienci" color='#23A403' onPress={handleCustomers}/>
                <View style={styles.buttonSpacing} />
                <Button title="Asortyment" color='#23A403'/>
                <View style={styles.buttonSpacing} />
                <Button title="Użytkownicy" color='#23A403' onPress={handleUsers} />
                <View style={styles.buttonSpacing} />
                <Button title="Produkty" color='#23A403' onPress={handleProducts} />
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