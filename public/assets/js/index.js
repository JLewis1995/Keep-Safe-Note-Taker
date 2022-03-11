let noteTitle = $(".note-title");
let noteText = $(".note-textarea");
let saveNoteBtn = $(".save-note");
let newNoteBtn = $(".new-note");
let noteList = $(".list-container .list-group");

// Show an element
const show = (elem) => {
  elem.style.display = "inline";
};

// Hide an element
const hide = (elem) => {
  elem.style.display = "none";
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.attr("readonly", true);
    noteText.attr("readonly", true);
    noteTitle.val(activeNote.title);
    noteText.val(activeNote.text);
  } else {
    noteTitle.attr("readonly");
    noteText.attr("readonly");
    noteTitle.val("");
    noteText.val("");
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.val(),
    text: noteText.val(),
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute("data-note")).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = () => {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.val().trim() || !noteText.val().trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === "/notes") {
    noteList.each((el) => (el.innerHTML = ""));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = "<li>";
    liEl.addClass("list-group-item");

    const spanEl = "<span>";
    spanEl.addclass("list-item-title");
    spanEl.text(text);
    spanEl.on("click", handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = ("<i>");
      delBtnEl.addClass(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      );
      delBtnEl.on("click", handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi("No saved Notes", false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === "/notes") {
    noteListItems.each((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === "/notes") {
  saveNoteBtn.on("click", handleNoteSave);
  newNoteBtn.on("click", handleNewNoteView);
  noteTitle.on("keyup", handleRenderSaveBtn);
  noteText.on("keyup", handleRenderSaveBtn);
}

getAndRenderNotes();
