import React, { useEffect } from 'react';
import MainRouter from './routes/MainRouter';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { MyContextControllerProvider } from './context';
import TodoApp from './screens/TodoApp';

const Initial = ()=>{
  const USERS = firestore().collection("USERS")
  const admin={
    name: "Tran Dwc Long",
    phone: "09090909090",
    address: "BinhDuong",
    email: "itlong301020003@gmail.com",
    role: "admin"
  }
  //check user Admin da dc DK chua
  USERS.doc(admin.email).onSnapshot((doc)=>{
    if(!doc.exists)
    {// dang ky user admin
      auth().createUserWithEmailAndPassword(admin.email, "1234567")
      .then(()=>{
        USERS.doc(admin.email).set(admin)   //luu tren firestore voi key la email
        console.log("create new accouunt admin")
      })
      .catch(e=>console.log(e))
    }
  })
}

const App =()=>{
  useEffect(()=> Initial(),[])
  return (
    <MyContextControllerProvider>
      <NavigationContainer>
          <PaperProvider>
            <MainRouter/>
          </PaperProvider>
      </NavigationContainer>
    </MyContextControllerProvider>
  );
}
export default App;