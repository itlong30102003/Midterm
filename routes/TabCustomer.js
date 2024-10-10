import { View } from "react-native"
import { Button } from "react-native-paper"
import { logout, useMyContextController } from "../context"
import TodoApp from "../screens/TodoApp"


const TabCustomer =()=>{
    const [controller, dispatch] = useMyContextController();
    const { user } = controller;
    const handleLogout =()=>{
        logout(dispatch)
    }
    return(
        <View style={{ flex: 1, justifyContent: "center" }}>
            <TodoApp/>
            <Button onPress={handleLogout}>Logout</Button>
        </View>
    )
}
export default TabCustomer;