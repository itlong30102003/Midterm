import { createContext, useContext, useMemo, useReducer } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

const MyContext = createContext();
// Display name
MyContext.displayName = "MyContextContext";

// Reducer
function reducer(state, action) {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value };
        case "LOGOUT":
            return { ...state, userLogin: null };
        default:
            throw new Error("Action không tồn tại");
    }
}

// Khởi tạo context
const MyContextControllerProvider = ({ children }) => {
    const InitialState = {
        userLogin: null,
        shoppingCart: {},
    };

    const [controller, dispatch] = useReducer(reducer, InitialState);

    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
};

// Hook để sử dụng context
function useMyContextController() {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error("useMyContextController phải được sử dụng bên trong MyContextControllerProvider");
    }
    return context;
}

// Tham chiếu collection
const USERS = firestore().collection("USERS");
const SERVICES = firestore().collection("SERVICES");

// Định nghĩa action login
const login = (dispatch, email, password) => {
    auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            USERS.doc(email)
                .onSnapshot(u => {
                    if (u.exists) {
                        console.log("Đăng nhập thành công với: " + u.id);
                        dispatch({ type: "USER_LOGIN", value: u.data() });
                    }
                });
        })
        .catch(e => Alert.alert("Sai email hoặc mật khẩu"));
};

// Định nghĩa action logout
const logout = (dispatch) => {
    auth().signOut()
        .then(() => dispatch({ type: "LOGOUT" }));
};



export {
    MyContextControllerProvider,
    reducer,
    useMyContextController,
    logout,
    login,

};
