import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, HelperText, Switch, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

const Register =({navigation})=>{
    const [fullName,setFullName] =useState("Tran Duc Long");
    const [gender,setGender] = useState(true) // true = female
    const [email, setEmail] = useState("itlong30102003@gmail.com");
    const [password, setPassword] = useState("123456");
    const [passwordConfirm, setPasswordConfirm] = useState("123456");
    const [phone, setPhone] = useState("99999999");
    const [address, setAddress] = useState("Binh Duong");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    //check
    const checkFullName =()=> fullName.length >0
    
    const checkPhone =()=> phone.length>0
    
    const checkEmail = ()=> {
        var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        return regex.test(email)
    }

    const checkPassword  = ()=>password.length >=6    
    const checkPasswordConfirm =()=> password===passwordConfirm
    //
    const cUSERS = firestore().collection("USERS")
    
    const createNewAccount = () =>{
        //Check account exists
        cUSERS.doc(email).get()
        .then(
            (u)=>{
                if(u.exists){
                    Alert.alert(`Email ${email} da ton tai`)
                }
                else
                { //create new account
                    auth().createUserWithEmailAndPassword(email,password)
                    .then(()=>{
                       //Add new user in cUSERS
                       cUSERS.doc(email)
                       .set({
                            fullName,
                            gender,
                            email,
                            phone,
                            address,
                            role: "customer"
                       })
                       .then(()=> navigation.navigate("login")) 
                       
                    })
                    .catch((e)=> console.log(e) )
                }
            }
        )
    }
    //
    return(
        <View style={style.container}>
            <Text style={style.title}>Create New Account</Text>
            <TextInput 
                value={fullName}
                placeholder="Input FullName"
                mode="outlined"
                style={style.textInput}
                onChangeText={setFullName}
            />
            <HelperText type="error" visible={!checkFullName()}>
                Full Name khong duoc de trong
            </HelperText>
            <View style={style.gender}>
                <Text> Female : Male </Text>
                <Switch value={gender} onValueChange={setGender}/>
            </View>

            <TextInput 
                value={email}
                placeholder="Input Email"
                mode="outlined"
                style={style.textInput}
                onChangeText={setEmail}
            />
            <HelperText type="error" visible={!checkEmail()}>
                Sai dia chi mail
            </HelperText>
            <TextInput 
                value={password}
                placeholder="Input Password"
                style={style.textInput}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                right={<TextInput.Icon icon={"eye"} onPress={()=>setShowPassword(!showPassword)}/>}
            />
            <HelperText type="error" visible={!checkPassword()}>
                Password co it nhat 6 ky tu
            </HelperText>
            <TextInput 
                value={passwordConfirm}
                placeholder="Input PasswordConfirm"
                style={style.textInput}
                onChangeText={setPasswordConfirm}
                secureTextEntry={!showPasswordConfirm}
                mode="outlined"
                right={<TextInput.Icon icon={"eye"} onPress={()=>setShowPasswordConfirm(!showPasswordConfirm)}/>}
            />
            <HelperText type="error" visible={!checkPasswordConfirm()}>
                Password Confirm khong trung
            </HelperText>
            <TextInput 
                value={phone}
                placeholder="Input Phone"
                style={style.textInput}
                onChangeText={setPhone}
                mode="outlined"
                left={<TextInput.Icon icon={'phone'}/>}
            />
            <HelperText type="error" visible={!checkPhone()}>
                phone khong duoc de trong
            </HelperText>
            <TextInput 
                value={address}
                placeholder="Input Address"
                style={style.textInput}
                onChangeText={setAddress}
                mode="outlined"
                left={<TextInput.Icon icon={'home'}/>}
            />
            
            <Button 
                style={style.button}
                onPress={createNewAccount}
                disabled={!checkEmail() || !checkPassword()|| !checkFullName() || !checkPasswordConfirm() || !checkPhone()} mode="contained"
            >
                Sign Up
            </Button>
            <View style={style.register}>
                <Text>Do you have a account?</Text>
                <Button
                    onPress={()=> navigation.navigate("login")}
                >
                    Login
                </Button>
            </View>
        </View>
    );
}
export default Register;

const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        padding: 15,
    },
    gender:{
        flexDirection:'row',
        alignItems:'center',
        margin:10
    },
    title:{
        color:"red",
        fontSize: 40,
        fontWeight:"bold",
        textAlign:'center',
        paddingBottom:30,
    },
    textInput:{
        borderRadius:10,
    },
    register:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center'

    },
    button:{
        marginTop: 10,
    },

})