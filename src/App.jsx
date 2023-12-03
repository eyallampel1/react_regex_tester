import { useState } from 'react'

import './App.css'
import RegexTester from "./Regex.jsx";

function App() {


  return (
    <>
        <RegexTester
            initialRegex="(\b)\w+(\b)"
            initialTestText={`hell\nmy name\nis weal lamp`}
            initialFlags={{ global: true, multiline: true, caseInsensitive: false }}
        />



    </>
  )
}

export default App