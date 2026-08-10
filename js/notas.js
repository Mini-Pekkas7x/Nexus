console.log("NEXUS — Notas iniciado!");


// =============================
// ELEMENTOS
// =============================

const newNoteButton =
    document.getElementById("new-note-button");

const modal =
    document.getElementById("note-modal");

const closeModal =
    document.getElementById("close-modal");

const cancelNote =
    document.getElementById("cancel-note");

const noteForm =
    document.getElementById("note-form");

const notesContainer =
    document.getElementById("notes-container");

const searchNotes =
    document.getElementById("search-notes");

const filterCategory =
    document.getElementById("filter-category");

// =============================
// DADOS
// =============================

let notes = NexusStorage.buscar("notas");


// =============================
// ABRIR MODAL
// =============================

newNoteButton.addEventListener("click", function () {

    document.getElementById("modal-title").textContent =
        "Nova nota";

    noteForm.reset();

    document.getElementById("note-id").value = "";

    modal.classList.remove("hidden");

});


// =============================
// FECHAR MODAL
// =============================

closeModal.addEventListener("click", function () {

    modal.classList.add("hidden");

});


cancelNote.addEventListener("click", function () {

    modal.classList.add("hidden");

});


// =============================
// SALVAR NOTA
// =============================

noteForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const id =
        document.getElementById("note-id").value;

    const title =
        document.getElementById("note-title").value.trim();

    const category =
        document.getElementById("note-category").value;

    const content =
        document.getElementById("note-content").value.trim();


    if (!title || !content) {

        alert("Preencha o título e o conteúdo.");

        return;

    }


    // =============================
    // EDITAR NOTA EXISTENTE
    // =============================

    if (id) {

        const note =
            notes.find(function (note) {

                return note.id === id;

            });


        if (note) {

            note.title = title;

            note.category = category;

            note.content = content;

            note.updatedAt =
                new Date().toISOString();

        }

    }


    // =============================
    // CRIAR NOVA NOTA
    // =============================

    else {

        const newNote = {

            id: crypto.randomUUID(),

            title: title,

            category: category,

            content: content,

            favorite: false,

            pinned: false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        notes.unshift(newNote);

    }


    // =============================
    // SALVAR
    // =============================

    NexusStorage.salvar(
        "notas",
        notes
    );


    noteForm.reset();

    document.getElementById("note-id").value = "";

    modal.classList.add("hidden");


    renderNotes();

});


// =============================
// MOSTRAR NOTAS
// =============================

function renderNotes() {

    const search =
        searchNotes.value
            .toLowerCase()
            .trim();

    const category =
        filterCategory.value;


    let filteredNotes = notes.filter(function (note) {

        const matchesSearch =
            note.title
                .toLowerCase()
                .includes(search)
            ||
            note.content
                .toLowerCase()
                .includes(search);


        const matchesCategory =
            category === "all"
            ||
            note.category === category;


        return matchesSearch && matchesCategory;

    });

    filteredNotes.sort(function (a, b) {

    // 1. Notas fixadas primeiro
    if (a.pinned !== b.pinned) {
        return b.pinned - a.pinned;
    }


    // 2. Favoritas depois
    if (a.favorite !== b.favorite) {
        return b.favorite - a.favorite;
    }


    // 3. Mais recentes primeiro
    const dateA =
        new Date(a.updatedAt || a.createdAt);

    const dateB =
        new Date(b.updatedAt || b.createdAt);


    return dateB - dateA;

});

    notesContainer.innerHTML = "";


    if (filteredNotes.length === 0) {

        notesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔎
                </div>

                <h3>Nenhuma nota encontrada</h3>

                <p>
                    Tente pesquisar outra coisa.
                </p>

            </div>

        `;

        return;

    }


    filteredNotes.forEach(function (note) {

        const noteCard =
            document.createElement("article");


        noteCard.className =
            "note-card";


        noteCard.innerHTML = `

            <div class="note-card-header">

                <div>

                    ${
                        note.pinned
                        ? `<span class="pin">📌</span>`
                        : ""
                    }

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                </div>


                <button
                    class="favorite-button"
                    onclick="toggleFavorite('${note.id}')"
                >
                    ${note.favorite ? "⭐" : "☆"}
                </button>

            </div>


            <span class="note-category">
                ${escapeHTML(note.category)}
            </span>


            <p class="note-preview">
                ${escapeHTML(note.content)}
            </p>


            <div class="note-footer">

                <span>
                    📅 ${formatDate(
                        note.updatedAt || note.createdAt
                    )}
                </span>


                <div class="note-buttons">

                    <button
                        onclick="editNote('${note.id}')"
                        title="Editar"
                    >
                        ✏️
                    </button>

                    <button
                        onclick="togglePinned('${note.id}')"
                        title="Fixar"
                    >
                        📌
                    </button>

                    <button
                        onclick="deleteNote('${note.id}')"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;


        notesContainer.appendChild(noteCard);

    });

}


// =============================
// FAVORITAR
// =============================

function toggleFavorite(id) {

    const note =
        notes.find(function (note) {

            return note.id === id;

        });


    if (!note) return;


    note.favorite =
        !note.favorite;


    NexusStorage.salvar("notas", notes);

    renderNotes();

}


// =============================
// FIXAR
// =============================

function togglePinned(id) {

    const note =
        notes.find(function (note) {

            return note.id === id;

        });


    if (!note) return;


    note.pinned =
        !note.pinned;


    NexusStorage.salvar("notas", notes);

    renderNotes();

}


// =============================
// EDITAR
// =============================

function editNote(id) {

    const note =
        notes.find(function (note) {

            return note.id === id;

        });


    if (!note) return;


    document.getElementById("modal-title").textContent =
        "Editar nota";


    document.getElementById("note-id").value =
        note.id;


    document.getElementById("note-title").value =
        note.title;


    document.getElementById("note-category").value =
        note.category;


    document.getElementById("note-content").value =
        note.content;


    modal.classList.remove("hidden");

}


// =============================
// EXCLUIR
// =============================

function deleteNote(id) {

    const confirmDelete =
        confirm("Deseja realmente excluir esta nota?");


    if (!confirmDelete) return;


    notes =
        notes.filter(function (note) {

            return note.id !== id;

        });


    NexusStorage.salvar("notas", notes);

    renderNotes();

}


// =============================
// FORMATAÇÃO
// =============================

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString("pt-BR");

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

searchNotes.addEventListener(
    "input",
    renderNotes
);


filterCategory.addEventListener(
    "change",
    renderNotes
);

// =============================
// INICIAR
// =============================

renderNotes();  

// =============================
// ABRIR MODAL PELO DASHBOARD
// =============================

const params =
    new URLSearchParams(
        window.location.search
    );


if (params.get("novo") === "true") {

    const newNoteButton =
        document.getElementById(
            "new-note-button"
        );


    if (newNoteButton) {

        newNoteButton.click();

    }

}