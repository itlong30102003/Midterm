import { FlatList, ScrollView, View } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth"; // Import Firebase Auth

const cTodos = firestore().collection("Todos");

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState("");

    const userId = auth().currentUser.uid; // Get the current user's ID

    const addNewTodo = () => {
        cTodos.add({
            title: todo,
            complete: false,
            userId: userId, // Add user ID to the to-do
        })
        .then(doc => {
            doc.update({ id: doc.id });
            console.log("Add new todo!");
            setTodo(""); // Clear input after adding
        })
        .catch(e => console.log(e));
    };

    useEffect(() => {
        const unsubscribe = cTodos
            .where("userId", "==", userId) // Fetch todos for the current user only
            .onSnapshot((Todos) => {
                let result = [];
                Todos.forEach((doc) => {
                    result.push({ ...doc.data(), id: doc.id }); // Include the ID in the result
                });
                setTodos(result);
                console.log(todos);
            });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [userId]); // Depend on userId

    const updateTodo = (item) => {
        cTodos.doc(item.id).update({
            complete: !item.complete,
        })
        .then(() => console.log("Update todo"))
        .catch(e => console.log(e));
    };

    const renderItem = ({ item }) => {
        return (
            <Button
                icon={item.complete ? "check" : "star"}
                style={{ alignItems: "flex-start" }}
                labelStyle={{ color: "black" }}
                onPress={() => updateTodo(item)}
            >
                {item.title}
            </Button>
        );
    };

   
    //
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: "blue" }}>
                <Appbar.Content
                    title={"Todo List"}
                    style={{ alignItems: "center" }}
                    color="white"
                />
            </Appbar.Header>
            <ScrollView style={{ flex: 1 }}>
                <FlatList
                    data={todos}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                />
            </ScrollView>
            <TextInput
                value={todo}
                placeholder="Input todo"
                onChangeText={setTodo}
            />
            <Button onPress={addNewTodo}>
                Add Todo
            </Button>
            
        </View>
    );
};

export default Home;