import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const Functions = () => {
  return (
    <View>
      <Text>Functions</Text>
    </View>
  )
}

// this stores data in async storage
export const dataStorage = async (value) => {
    try{
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('userObject', jsonValue);
    }catch(e){
        console.log(e);
    }
}

// this retrieves data from async storage
export const dataRetrieve = async () => {
    try {
        const value = await AsyncStorage.getItem('userObject');
        if(value !== null){
            return value;
        }
    } catch (error) {
        
    }
}

// this removes data from async storage
export const dataRemove = async () => {
    try {
        await AsyncStorage.removeItem('userObject');
    } catch (error) {
        
    }
}



const styles = StyleSheet.create({})