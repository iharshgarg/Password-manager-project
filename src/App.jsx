import { useState, useEffect } from 'react'
import './App.css'
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [form, setform] = useState({ site: "", username: "", password: "" })
  const [passArray, setPassArray] = useState([])
  const [showPass, setshowPass] = useState({})

  const togglePass = (id) => {
    setshowPass(prev => ({ ...prev, [id]: !prev[id] }))
  }


  const getPasswords = async () => {
    let req = await fetch("http://" + window.location.hostname + ":3000")
    let passwords = await req.json()
    setPassArray(passwords)
  }

  useEffect(() => {
    getPasswords()
  }, [])


  const savePass = async () => {
    if (form.site.length && form.username.length && form.password.length) {




      if (form.id) {
        await fetch("http://" + window.location.hostname + ":3000", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })
      }


      const newUuidv4 = uuidv4()
      setPassArray([...passArray, { ...form, id: newUuidv4 }])
      await fetch("http://" + window.location.hostname + ":3000", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: newUuidv4 }) })
      setform({ site: "", username: "", password: "" })
    }

  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      savePass();
    }
  }

  const editPass = (id) => {
    setform({ ...passArray.filter(i => i.id === id)[0], id: id })
    setPassArray(passArray.filter(item => item.id !== id))

  }

  const deletePass = async (id) => {
    setPassArray(passArray.filter(item => item.id !== id))
    let res = await fetch("http://" + window.location.hostname + ":3000", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
  }


  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }



  return (
    <>

      <div class="bg md:bg-cover md:bg-no-repeat"></div>
      <div class="container max-w-full">


        <div class="content">

          <div class="bg-black text-white py-4 flex w-full md:justify-center mb-8">
            <img src="logo.png" alt="Logo" class="h-8 w-8 ml-4 mx-3" />
            <span class="font-bold text-3xl">PassMan</span>
          </div>

          <div className='form-div flex flex-col items-center'>
            <input value={form.site} placeholder='Site' onChange={handleChange} type="text" name='site' className='rounded-lg my-1 border border-black p-1' />
            <input value={form.username} placeholder='Username' onChange={handleChange} type="text" name='username' className='rounded-lg my-1 border border-black p-1' />
            <input value={form.password} placeholder='Password' onChange={handleChange} onKeyDown={handleKeyDown} type="password" name='password' className='rounded-lg my-1 border border-black p-1' />
            <button onClick={savePass} className='border border-white text-white rounded-lg max-md:w-3/12 w-1/12 p-1 my-3'>Save</button>
          </div>
          <div className='table-div mt-4 text-white'>
            {passArray.length===0 && <div className='flex justify-center items-center mt-20'>No Passwords to show</div> }
            {passArray.length!==0 && <table className="table-auto w-full">
              <thead>
                <tr className='h-14'>
                  <th>Site</th>
                  <th>Username</th>
                  <th>Pass</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passArray.map((item, index) => {
                  return <tr key={index}>
                    <td className='text-center h-11'>{item.site}</td>
                    <td className='text-center'>{item.username}</td>
                    <td className='text-center'>
                      {showPass[item.id] ? item.password : '••••••••'}
                      <button onClick={() => togglePass(item.id)} className='ml-2 align-middle'>
                        <img src={showPass[item.id] ? 'eyecross.png' : 'eye.png'} className='h-5 w-5 inverted' />
                      </button>
                    </td>
                    <td className='text-center'>
                      <span className='cursor-pointer m-1 underline' onClick={() => { editPass(item.id) }}>Edit</span>
                      <span className='cursor-pointer m-1 underline' onClick={() => { deletePass(item.id) }}>Delete</span>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>}
          </div>
        </div>

      </div>
    </>
  )
}

export default App