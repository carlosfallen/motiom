import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react"; // Importando o Editor do TinyMCE
import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase"; // Firebase

const App = () => {
  const [note, setNote] = useState(""); // Estado para armazenar o conteúdo da nota
  const [notes, setNotes] = useState([]); // Estado para armazenar as notas salvas

  // Função para salvar a nota no Firestore
  const saveNote = async () => {
    try {
      await addDoc(collection(db, "notes"), {
        content: note,
        timestamp: new Date(),
      });
      alert("Nota salva com sucesso!");
      setNote(""); // Limpa o campo de texto após salvar
      fetchNotes(); // Atualiza a lista de notas
    } catch (e) {
      console.error("Erro ao salvar nota: ", e);
      alert("Erro ao salvar nota.");
    }
  };

  // Função para buscar as notas salvas do Firestore e ordenar pela data
  const fetchNotes = async () => {
    const querySnapshot = await getDocs(collection(db, "notes"));
    const notesArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notesArray);
  };

  // Função para apagar a nota
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      alert("Nota apagada com sucesso!");
      fetchNotes(); // Atualiza a lista de notas após deletar
    } catch (e) {
      console.error("Erro ao apagar nota: ", e);
      alert("Erro ao apagar nota.");
    }
  };

  useEffect(() => {
    fetchNotes(); // Carrega as notas quando o componente for montado
  }, []);

  return (
    <div className="container">
      <h1>Bloco de Notas com Formatação</h1>

      {/* Editor de Texto */}
      <Editor
        apiKey="uvvatgqiu3s3gb10mbw9xhjuww109t0l4z2jwjyabkzfuj5r"
        value={note}
        init={{
          height: 300,
          menubar: false, // Remove o menu superior
          plugins: [
            "code", // Plugin para exibir código
          ],
          toolbar: "undo redo | bold italic | code", // Apenas negrito, itálico e campo de código
          branding: false, // Remove o branding do TinyMCE
        }}
        onEditorChange={(content) => setNote(content)} // Atualiza o conteúdo da nota
      />

      {/* Botão para salvar a nota */}
      <button onClick={saveNote} className="save-button">
        Salvar Nota
      </button>

      <h2>Notas Salvas</h2>

      {/* Lista de Notas Salvas */}
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={note.id} className="note-item">
            <div
              dangerouslySetInnerHTML={{ __html: note.content }}
              className="note-content"
            />
            <small>{note.timestamp.toDate().toLocaleString()}</small>
            <button onClick={() => deleteNote(note.id)} className="delete-button">
              Apagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
