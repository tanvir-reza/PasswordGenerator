/* eslint-disable react/self-closing-comp */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable semi */
import React, { useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from "react-native";
import Toast from 'react-native-toast-message';

// Form Validation

import * as Yup from "yup";
import { Formik } from "formik";
import BouncyCheckbox  from "react-native-bouncy-checkbox";

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(50, "Password is too long - should be 50 chars maximum.")
    .required("Password is required"),
})

function App() {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [number, setNumber] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passwordLength: number) => {
    console.log(passwordLength);
    let characterList = '';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';

    if (upperCase) {
      characterList += upperCaseChars;
    }
    if (lowerCase) {
      characterList += lowerCaseChars;
    }
    if (number) {
      characterList += digits;
    }
    if (symbols) {
      characterList += specialChars;
    }
    else {
      characterList += lowerCaseChars;
      characterList += upperCaseChars;
      setLowerCase(true);
      setUpperCase(true);
    }

    const passwordResult = createPassword()(characterList, passwordLength);
    setPassword(passwordResult);
    setIsPassGenerated(true);
  }

  const createPassword = () => (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  const resetPasswordState = () => {
    setPassword('');
    setIsPassGenerated(false);
    setLowerCase(false);
    setUpperCase(false);
    setNumber(false);
    setSymbols(false);
    console.log('Reset');
  }




  return (
    <ScrollView keyboardShouldPersistTaps="handled" >
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title} >Password Generator</Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={(values) => {
              console.log(values);
              generatePasswordString(+values.passwordLength); //Todo
             }}
          >
              {({
                values,
                errors,
                touched,
                isValid,
                handleChange,
                handleSubmit,
                handleReset,
                /* and other goodies */
              }) => (
                <>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="Ex : 9"
                        onChangeText={handleChange('passwordLength')}
                      value={values.passwordLength}
                      />
                    </View>
                  </View>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputColumnLower}>
                      <Text style={styles.headingLower}>Include Lowercase</Text>
                      <BouncyCheckbox
                        useBuiltInState={true}
                        isChecked={lowerCase}
                        fillColor="green"
                      onPress={() => {
                        setLowerCase(!lowerCase);
                        }}
                        style={styles.checkboxStyle}
                      />
                    </View>
                  </View>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputColumnLower}>
                      <Text style={styles.headingLower}>Include UpperCase</Text>
                      <BouncyCheckbox
                        useBuiltInState={true}
                        isChecked={upperCase}
                        fillColor="orange"
                      onPress={() => {
                          setUpperCase(!upperCase);
                        }}
                        style={styles.checkboxStyle}
                      />
                    </View>
                  </View>
                  <View style={styles.inputWrapper}>
                      <View style={styles.inputColumnLower}>
                        <Text style={styles.headingLower}>Include Number</Text>
                        <BouncyCheckbox
                          useBuiltInState={true}
                          isChecked={number}
                          fillColor="purple"
                          onPress={() => {
                            setNumber(!number);
                          }}
                          style={styles.checkboxStyle}
                        />
                      </View>
                  </View>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputColumnLower}>
                      <Text style={styles.headingLower}>Include Symbol</Text>
                      <BouncyCheckbox
                        useBuiltInState={true}
                        isChecked={symbols}
                        fillColor="blue"
                        onPress={() => {
                          setSymbols(!symbols);
                        }}
                        style={styles.checkboxStyle}
                      />
                    </View>
                  </View>
                  <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={() => handleSubmit()}
                  ><Text style={styles.primaryBtnTxt}>Generate Password</Text></TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}
                  ><Text style={styles.secondaryBtnTxt}>Reset</Text></TouchableOpacity>
                  </View>
                  {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>{errors.passwordLength}</Text>
                      )}
                </>
              )}
          </Formik>
        </View>
        {isPassGenerated ? (
            <View style={styles.passwordContainer}>
              <Text style={styles.copyTag}>Long Press to Copy</Text>
              <Text selectable={true} style={styles.PassContainerTxt}>{password}</Text>
            </View>
          ) : null}
      </SafeAreaView>


    </ScrollView>
  );
}



const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 29,
    fontWeight: "bold",
    fontFamily: "Arial",
    color: "white",
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    fontFamily: "Georgia",
    marginBottom: 20,
    padding: 10,
    color: "white",
  },
  inputWrapper: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    margin: 20,
    alignItems: "center",
  },
  inputColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    padding: 10,
    width: "100%",
  },
  heading: {
    fontSize: 15,
    width: "auto",
    fontWeight: 800,
    fontFamily: "Arial",
    marginLeft: 30,
    color: "white",
  },
  headingLower: {
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "Arial",
    marginLeft: 40,
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  inputColumnLower: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  checkboxStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
  },
  errorText: {
    color: "red",
    fontSize: 15,
    fontWeight: "bold",

  },
  inputStyle: {
    width: "35%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgrey",
    height: 40,
  },
  primaryBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  primaryBtnTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  secondaryBtnTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  passwordContainer: {
    padding: 30,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    height: 200,
    width: "95%",
    elevation: 10,
    shadowColor: "blue",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
  },
  PassContainerTxt: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Times New Roman",
    color: "black",
    textAlign: "center",
    marginTop: 30,
  },
  copyTag: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#10A881",
  },

});



export default App;
