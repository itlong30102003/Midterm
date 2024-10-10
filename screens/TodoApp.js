import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

const cTodos = firestore().collection("Todos")

const TodoApp=({userID})=>{

    const [todos ,setTodos] = useState([]);
    const [todo, setTodo] = useState([]);
    
    const userId = auth().currentUser.uid; 

    const addNewTodo=()=>{
        cTodos.add({
            title: todo,
            complete: false,
            userId: userId,
        })
        .then(doc =>
            {
            doc.update({id: doc.id})
            console.log("add new todo!")
            setTodo("");
            }
        )
        .catch(e => console.log(e))
    }
    useEffect(()=>{ 
        cTodos.onSnapshot((Todos)=>{
            let result=[]
            Todos.forEach((doc)=>{
                result.push(doc.data())
            })
            setTodos(result)
            console.log(todos)
        })
    },[ cTodos])
   
    const updateTodo = (item) => {
        cTodos.doc(item.id).update({
            complete: !item.complete
        })
        .then(() => console.log("Update todo"))
        .catch(e => console.log(e));
    }   
    const renderItem= ({item}) => {
        return(
            <Button icon={(item.complete)? "check":"close" }
                onPress={()=>updateTodo(item)}
            >
                {item.title}
            </Button>
        )
    }

    return(
        <View style={{flex:1}}>
            <Appbar.Header style={{
                backgroundColor:'blue'
                }}>
                <Appbar.Content
                    title={'TODO List'} 
                    style={{alignItems:"center",}} 
                    color="white"
                />
            </Appbar.Header>

            <ScrollView style={{flex:1}}>
                <FlatList
                data={todos}
                keyExtractor={item=>item.id}
                renderItem={renderItem}
                />
            </ScrollView>
            <TextInput
             placeholder="Input todo" 
             value={todo} 
             onChangeText={setTodo}
            />
            <Button onPress={addNewTodo}>Add TODO</Button>
        </View>
    );
}
export default TodoApp;

