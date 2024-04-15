import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // state
  const[notes, setNotes] = useState(null);
  const[createForm, setCreateForm] = useState({
    title: '',
    body: '',
  });

  const [updateForm, setUpdateForm ] = useState({
    _id: null,
    title: '',
    body: '',
  })


  // useEffect
  useEffect(() => {
    fetchNotes();
  }, []);


  // functions
  const fetchNotes = async () =>{
    // Fetch th notes
    const res = await axios.get('http://localhost:3000/notes')
     // set to state
     setNotes(res.data.notes)
  };

  const updateCreateFormField = (e) => {
    const {name, value} = e.target;

    setCreateForm({
      ...createForm,
      [name]: value, 
    })
    console.log({name, value})
  };

  const createNote = async (e) => {
    e.preventDefault();

    // Create the note
    const res = await axios.post("http://localhost:3000/notes", createForm)

    // Update state
    setNotes([...notes, res.data.note]);

    // clear form state
    setCreateForm({title:'', body: '',})

  };

  const deleteNote =async (_id) => {
    // delete note
   const res = await axios.delete(`http://localhost:3000/notes/${_id}`);
   console.log(res)

    // update state
    const newNotes =[...notes].filter(notes => {
      return notes._id !== _id;
    });
setNotes(newNotes);
  };

  const handleUpdateFieldChange = (e) => {
    const {value, name } = e.target

    setUpdateForm({
      ...updateForm,
      [name]: value,
    })
  };

  const toggleUpdate = (note) => {
    // set state on update form
    setUpdateForm({title: note.title, body: note.body, _id: note._id})
  };

  const updateNote = async (e) => {
    e.preventDefault();

    const { title, body} = updateForm;
    // send the update request
   const res = await axios.put(`http://localhost:3000/notes/${updateForm._id}`, {title,body})

    // update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex(note => {
      return note._id === updateForm._id
    });
    newNotes[noteIndex] = res.data.note;

    setNotes(newNotes);

    // clear update form state
    setUpdateForm({
      _id: null,
      title: '',
      body: '',
    })
  }

  return(
    <div className="App">
      <div>
        <h2>Notes:</h2>
        {notes &&
         notes.map(note => {
          return(
          <div key={note._id}>
            <h3>{note.title}</h3>
            <button onClick={() => deleteNote(note._id)}>Delete note
            </button>
            <button onClick={() => toggleUpdate(note)}>Update note</button>
            </div>
         );
        })}
      </div>

      {updateForm._id && (
      <div>
        <h2>Update note</h2>
        <form onSubmit={updateNote}>
          <input onChange = {handleUpdateFieldChange}
           value={updateForm.title} 
           name="title"/>
          <textarea onChange = {handleUpdateFieldChange}
           value={updateForm.body} 
           name="body"/>
          <button type="submit">Update note</button>
        </form>
      </div>
      )}

      {!updateForm._id && (
         <div>
        <h2>Create note</h2>
        <form onSubmit={createNote}>
          <input 
          onChange={updateCreateFormField} 
          value={createForm.title} 
          name="title"
          />
          <textarea
          onChange={updateCreateFormField}
           value={createForm.body} 
           name="body"
           />
          <button type="submit">Create note</button>
        </form>
      </div>
      )}
    </div>
  )
}

export default App;
