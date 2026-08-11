console.log("NEXUS — Notas iniciado!");

// ======================================================
// CONFIGURAÇÃO DA API
// ======================================================

const API_URL = "https://nexus-api-kdu5.onrender.com";

// ======================================================
// ELEMENTOS
// ======================================================

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

// ======================================================
// DADOS
// ======================================================

let notes = [];

// ======================================================
// ABRIR MODAL
// ======================================================

if (newNoteButton) {

    newNoteButton.addEventListener("click", function () {

        document.getElementById("modal-title").textContent =
            "Nova nota";

        noteForm.reset();

        document.getElementById("note-id").value = "";

        modal.classList.remove("hidden");

    });

}

// ======================================================
// FECHAR MODAL
// ======================================================

if (closeModal) {

    closeModal.addEventListener("click", function () {

        modal.classList.add("hidden");

    });

}

if (cancelNote) {

    cancelNote.addEventListener("click", function () {

        modal.classList.add("hidden");

    });

}

// ======================================================
// CARREGAR NOTAS DA API
// ======================================================

async function loadNotes() {

    try {

        console.log("📡 Buscando notas...");

        const response = await fetch(API_URL);

        const result = await response.json();

        console.log("📥 Resposta da API:", result);

        if (!response.ok || !result.sucesso) {

            throw new Error(
                result.erro ||
                result.mensagem ||
                "Erro ao carregar notas."
            );

        }

        notes = result.notas || [];

        console.log("✅ Notas carregadas:", notes);

        renderNotes();

    } catch (error) {

        console.error(
            "❌ Erro ao carregar notas:",
            error
        );

        notesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Não foi possível carregar as notas
                </h3>

                <p>
                    Verifique se o backend do NEXUS está funcionando.
                </p>

            </div>

        `;

    }

}

// ======================================================
// SALVAR / EDITAR NOTA
// ======================================================

if (noteForm) {

    noteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const id =
                document.getElementById("note-id").value;

            const title =
                document
                    .getElementById("note-title")
                    .value
                    .trim();

            const category =
                document
                    .getElementById("note-category")
                    .value;

            const content =
                document
                    .getElementById("note-content")
                    .value
                    .trim();

            // ==================================================
            // VALIDAÇÃO
            // ==================================================

            if (!title || !content) {

                alert(
                    "Preencha o título e o conteúdo."
                );

                return;

            }

            try {

                let response;

                // ==================================================
                // EDITAR NOTA
                // ==================================================

                if (id) {

                    console.log(
                        "✏️ Editando nota:",
                        id
                    );

                    response = await fetch(
                        `${API_URL}/${id}`,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                title: title,

                                category: category,

                                content: content

                            })

                        }
                    );

                }

                // ==================================================
                // CRIAR NOTA
                // ==================================================

                else {

                    console.log(
                        "📝 Criando nova nota..."
                    );

                    response = await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                title: title,

                                category: category,

                                content: content,

                                favorite: false,

                                pinned: false

                            })

                        }
                    );

                }

                // ==================================================
                // LER RESPOSTA
                // ==================================================

                const result =
                    await response.json();

                console.log(
                    "📥 Resposta ao salvar:",
                    result
                );

                // ==================================================
                // VERIFICAR ERRO
                // ==================================================

                if (
                    !response.ok ||
                    !result.sucesso
                ) {

                    console.error(
                        "❌ Erro retornado pela API:",
                        result
                    );

                    alert(
                        result.mensagem ||
                        result.erro ||
                        "Não foi possível salvar a nota."
                    );

                    return;

                }

                // ==================================================
                // SUCESSO
                // ==================================================

                console.log(
                    "✅ Nota salva com sucesso!"
                );

                noteForm.reset();

                document.getElementById(
                    "note-id"
                ).value = "";

                modal.classList.add("hidden");

                await loadNotes();

            } catch (error) {

                console.error(
                    "❌ Erro ao salvar nota:",
                    error
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );

}

// ======================================================
// MOSTRAR NOTAS
// ======================================================

function renderNotes() {

    if (!notesContainer) {
        return;
    }

    const search =
        searchNotes
            ? searchNotes.value
                .toLowerCase()
                .trim()
            : "";

    const category =
        filterCategory
            ? filterCategory.value
            : "all";

    // ==================================================
    // FILTRAR
    // ==================================================

    let filteredNotes =
        notes.filter(function (note) {

            const title =
                (note.title || "")
                    .toLowerCase();

            const content =
                (note.content || "")
                    .toLowerCase();

            const matchesSearch =
                title.includes(search) ||
                content.includes(search);

            const matchesCategory =
                category === "all" ||
                note.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );

        });

    // ==================================================
    // ORDENAR
    // ==================================================

    filteredNotes.sort(
        function (a, b) {

            // Fixadas primeiro

            if (
                Boolean(a.pinned) !==
                Boolean(b.pinned)
            ) {

                return (
                    Number(Boolean(b.pinned)) -
                    Number(Boolean(a.pinned))
                );

            }

            // Favoritas depois

            if (
                Boolean(a.favorite) !==
                Boolean(b.favorite)
            ) {

                return (
                    Number(Boolean(b.favorite)) -
                    Number(Boolean(a.favorite))
                );

            }

            // Mais recentes primeiro

            const dateA =
                new Date(
                    a.updated_at ||
                    a.updatedAt ||
                    a.created_at ||
                    a.createdAt ||
                    0
                );

            const dateB =
                new Date(
                    b.updated_at ||
                    b.updatedAt ||
                    b.created_at ||
                    b.createdAt ||
                    0
                );

            return dateB - dateA;

        }
    );

    // ==================================================
    // LIMPAR
    // ==================================================

    notesContainer.innerHTML = "";

    // ==================================================
    // NENHUMA NOTA
    // ==================================================

    if (filteredNotes.length === 0) {

        notesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔎
                </div>

                <h3>
                    Nenhuma nota encontrada
                </h3>

                <p>
                    Tente pesquisar outra coisa.
                </p>

            </div>

        `;

        return;

    }

    // ==================================================
    // CRIAR CARDS
    // ==================================================

    filteredNotes.forEach(
        function (note) {

            const noteCard =
                document.createElement(
                    "article"
                );

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
                        title="Favoritar"
                    >

                        ${
                            note.favorite
                                ? "⭐"
                                : "☆"
                        }

                    </button>

                </div>

                <span class="note-category">

                    ${escapeHTML(
                        note.category || ""
                    )}

                </span>

                <p class="note-preview">

                    ${escapeHTML(
                        note.content || ""
                    )}

                </p>

                <div class="note-footer">

                    <span>

                        📅 ${formatDate(
                            note.updated_at ||
                            note.updatedAt ||
                            note.created_at ||
                            note.createdAt
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

            notesContainer.appendChild(
                noteCard
            );

        }
    );

}

// ======================================================
// FAVORITAR
// ======================================================

async function toggleFavorite(id) {

    const note =
        notes.find(
            function (note) {

                return (
                    String(note.id) ===
                    String(id)
                );

            }
        );

    if (!note) {
        return;
    }

    const newValue =
        !Boolean(note.favorite);

    try {

        const response =
            await fetch(
                `${API_URL}/${id}/favorite`,
                {

                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        favorite:
                            newValue

                    })

                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.sucesso
        ) {

            throw new Error(
                result.erro ||
                result.mensagem ||
                "Erro ao favoritar nota."
            );

        }

        await loadNotes();

    } catch (error) {

        console.error(
            "❌ Erro ao favoritar:",
            error
        );

        alert(
            "Não foi possível alterar o favorito."
        );

    }

}

// ======================================================
// FIXAR
// ======================================================

async function togglePinned(id) {

    const note =
        notes.find(
            function (note) {

                return (
                    String(note.id) ===
                    String(id)
                );

            }
        );

    if (!note) {
        return;
    }

    const newValue =
        !Boolean(note.pinned);

    try {

        const response =
            await fetch(
                `${API_URL}/${id}/pinned`,
                {

                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        pinned:
                            newValue

                    })

                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.sucesso
        ) {

            throw new Error(
                result.erro ||
                result.mensagem ||
                "Erro ao fixar nota."
            );

        }

        await loadNotes();

    } catch (error) {

        console.error(
            "❌ Erro ao fixar:",
            error
        );

        alert(
            "Não foi possível alterar a nota fixada."
        );

    }

}

// ======================================================
// EDITAR
// ======================================================

function editNote(id) {

    const note =
        notes.find(
            function (note) {

                return (
                    String(note.id) ===
                    String(id)
                );

            }
        );

    if (!note) {
        return;
    }

    document.getElementById(
        "modal-title"
    ).textContent =
        "Editar nota";

    document.getElementById(
        "note-id"
    ).value =
        note.id;

    document.getElementById(
        "note-title"
    ).value =
        note.title || "";

    document.getElementById(
        "note-category"
    ).value =
        note.category || "";

    document.getElementById(
        "note-content"
    ).value =
        note.content || "";

    modal.classList.remove(
        "hidden"
    );

}

// ======================================================
// EXCLUIR
// ======================================================

async function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Deseja realmente excluir esta nota?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE"

                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.sucesso
        ) {

            throw new Error(
                result.erro ||
                result.mensagem ||
                "Erro ao excluir nota."
            );

        }

        await loadNotes();

    } catch (error) {

        console.error(
            "❌ Erro ao excluir:",
            error
        );

        alert(
            "Não foi possível excluir a nota."
        );

    }

}

// ======================================================
// FORMATAÇÃO DE DATA
// ======================================================

function formatDate(date) {

    if (!date) {
        return "";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "";

    }

    return parsedDate
        .toLocaleDateString(
            "pt-BR"
        );

}

// ======================================================
// SEGURANÇA
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;

}

// ======================================================
// PESQUISA
// ======================================================

if (searchNotes) {

    searchNotes.addEventListener(
        "input",
        renderNotes
    );

}

if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        renderNotes
    );

}

// ======================================================
// INICIAR
// ======================================================

loadNotes();

// ======================================================
// ABRIR MODAL PELO DASHBOARD
// ======================================================

const params =
    new URLSearchParams(
        window.location.search
    );

if (
    params.get("novo") ===
    "true"
) {

    if (newNoteButton) {

        newNoteButton.click();

    }

}