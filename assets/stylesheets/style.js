import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0D1B2A'
    },
    errorText:{
      color: '#780000', 
    },
    NavCon:{
      position: 'absolute',
      alignItems: 'center',
      bottom: 20
    },
    NavBar:{
      flexDirection:'row',
      backgroundColor: '#eee',
      width: '90%',
      justifyContent: 'space-evenly',
      borderRadius: 40
    },
    image: {
        width: 70, // Set the width and height as needed
        height: 50,
    },
    input:{
        borderRadius: 4, 
        width: 300, 
        height: 40, 
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        color: 'black',
    },title:{
      fontSize: 40,
      height: 140,
      fontWeight: 'bold',
      color: '#E0E1DD', 
      textAlign: 'center'
    }, 
    text:{
      fontSize: 20,
      height: 50,
      fontWeight: 'bold',
      color: '#E0E1DD', 
    },
    button:{
      alignSelf: 'center',
      width: 300,
      height: 40,
      borderRadius:4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'navy',
      marginBottom: 20
    }, buttonText:{
      color: 'white'
    }, buttonInfo: {
      alignSelf: 'center',
   
      width: 300,
      borderRadius:4,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    }, buttonInfoText:{
      color: '#415A77'
    },



    button: {
      backgroundColor: '#415A77', 
      padding: 15,
      width: 300,
      height: 60,
      alignSelf: 'center',
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    button2: {
      backgroundColor: '#ff0000', 
      padding: 15,
      width: 300,
      height: 60,
      alignSelf: 'center',
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#ffffff', 
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default styles;