console.log("NEXUS — Dashboard iniciado!");


// =============================
// ELEMENTOS
// =============================

const notesCount =
    document.getElementById("notes-count");

const recentNotes =
    document.getElementById("recent-notes");


// =============================
// CARREGAR NOTAS
// =============================

const notes =
    NexusStorage.buscar("notas");


// =============================
// CONTADOR
// =============================

notesCount.textContent =
    notes.length;


// =============================
// NOTAS RECENTES
// =============================

function renderRecentNotes() {

    recentNotes.innerHTML = "";


    if (notes.length === 0) {

        recentNotes.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    📝
                </div>

                <p>
                    Nenhuma nota ainda.
                </p>

            </div>

        `;

        return;

    }


    // Ordenar pelas mais recentes

    const sortedNotes =
        [...notes].sort(function (a, b) {

            const dateA =
                new Date(
                    a.updatedAt || a.createdAt
                );

            const dateB =
                new Date(
                    b.updatedAt || b.createdAt
                );

            return dateB - dateA;

        });


    // Pegar somente 3

    const latestNotes =
        sortedNotes.slice(0, 3);


    latestNotes.forEach(function (note) {

        const item =
            document.createElement("div");


        item.className =
            "dashboard-note";


        item.innerHTML = `

            <div class="dashboard-note-icon">
                📝
            </div>


            <div class="dashboard-note-info">

                <strong>
                    ${escapeHTML(note.title)}
                </strong>

                <span>
                    ${escapeHTML(note.category)}
                </span>

            </div>

        `;


        recentNotes.appendChild(item);

    });

}


// =============================
// SEGURANÇA DO TEXTO
// =============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =============================
// INICIAR
// =============================

renderRecentNotes();