require("dotenv").config();

const express = require("express");
const cors = require("cors");

const supabase = require("./supabase");

const app = express();

const PORT = process.env.PORT || 3000;

// =================================
// MIDDLEWARES
// =================================

app.use(cors());
app.use(express.json());

// =================================
// ROTA PRINCIPAL
// =================================

app.get("/", (req, res) => {
    res.json({
        mensagem: "NEXUS API funcionando! 🚀"
    });
});

// =================================
// TESTAR SUPABASE
// =================================

app.get("/api/teste", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("notas")
            .select("*")
            .limit(1);

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao conectar ao Supabase.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "NEXUS conectado ao Supabase! 🚀",
            dados: data
        });

    } catch (error) {
        console.error("Erro:", error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        });
    }
});

// =================================
// NOTAS — LISTAR
// =================================

app.get("/api/notas", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("notas")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error("Erro ao buscar notas:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar notas.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            notas: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// NOTAS — CRIAR
// =================================

app.post("/api/notas", async (req, res) => {
    try {
        const {
            title,
            content,
            category,
            favorite,
            pinned
        } = req.body;

        if (!title) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "O título da nota é obrigatório."
            });
        }

        const { data, error } = await supabase
            .from("notas")
            .insert([
                {
                    title,
                    content: content || "",
                    category: category || "",
                    favorite: favorite || false,
                    pinned: pinned || false
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Erro ao criar nota:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao criar nota.",
                erro: error.message
            });
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Nota criada com sucesso! 📝",
            nota: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// NOTAS — EDITAR
// =================================

app.put("/api/notas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            content,
            category
        } = req.body;

        if (!title) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "O título da nota é obrigatório."
            });
        }

        const { data, error } = await supabase
            .from("notas")
            .update({
                title,
                content: content || "",
                category: category || "",
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro ao editar nota:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao editar nota.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Nota editada com sucesso! ✏️",
            nota: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// NOTAS — EXCLUIR
// =================================

app.delete("/api/notas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("notas")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Erro ao excluir nota:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao excluir nota.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Nota excluída com sucesso! 🗑️"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// NOTAS — FAVORITAR / DESFAVORITAR
// =================================

app.patch("/api/notas/:id/favorite", async (req, res) => {
    try {
        const { id } = req.params;
        const { favorite } = req.body;

        const { data, error } = await supabase
            .from("notas")
            .update({
                favorite: Boolean(favorite),
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro ao alterar favorito:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao alterar favorito.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Favorito atualizado! ⭐",
            nota: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// NOTAS — FIXAR / DESFIXAR
// =================================

app.patch("/api/notas/:id/pinned", async (req, res) => {
    try {
        const { id } = req.params;
        const { pinned } = req.body;

        const { data, error } = await supabase
            .from("notas")
            .update({
                pinned: Boolean(pinned),
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro ao alterar fixação:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao alterar fixação.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Fixação atualizada! 📌",
            nota: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// ANIVERSARIANTES — LISTAR
// =================================

app.get("/api/aniversariantes", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("aniversariantes")
            .select("*")
            .order("date", {
                ascending: true
            });

        if (error) {
            console.error(
                "Erro ao buscar aniversariantes:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar aniversariantes.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            aniversariantes: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// ANIVERSARIANTES — CRIAR
// =================================

app.post("/api/aniversariantes", async (req, res) => {
    try {
        const {
            name,
            date,
            note
        } = req.body;

        if (!name || !date) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome e data de nascimento são obrigatórios."
            });
        }

        const { data, error } = await supabase
            .from("aniversariantes")
            .insert([
                {
                    name,
                    date,
                    note: note || ""
                }
            ])
            .select()
            .single();

        if (error) {
            console.error(
                "Erro ao criar aniversariante:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao criar aniversariante.",
                erro: error.message
            });
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Aniversariante criado com sucesso! 🎂",
            aniversariante: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// ANIVERSARIANTES — EDITAR
// =================================

app.put("/api/aniversariantes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            date,
            note
        } = req.body;

        if (!name || !date) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome e data são obrigatórios."
            });
        }

        const { data, error } = await supabase
            .from("aniversariantes")
            .update({
                name,
                date,
                note: note || "",
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error(
                "Erro ao editar aniversariante:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao editar aniversariante.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Aniversariante atualizado com sucesso! ✏️",
            aniversariante: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// ANIVERSARIANTES — EXCLUIR
// =================================

app.delete("/api/aniversariantes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("aniversariantes")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(
                "Erro ao excluir aniversariante:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao excluir aniversariante.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Aniversariante excluído com sucesso! 🗑️"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// CONQUISTAS — LISTAR
// =================================

app.get("/api/conquistas", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("conquistas")
            .select("*")
            .order("date", {
                ascending: false
            });

        if (error) {
            console.error("Erro ao buscar conquistas:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar conquistas.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            conquistas: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// CONQUISTAS — CRIAR
// =================================

app.post("/api/conquistas", async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date
        } = req.body;

        if (!title || !description || !date) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Título, descrição e data são obrigatórios."
            });
        }

        const { data, error } = await supabase
            .from("conquistas")
            .insert([
                {
                    title,
                    description,
                    category: category || "Outros",
                    date
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Erro ao criar conquista:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao criar conquista.",
                erro: error.message
            });
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Conquista criada com sucesso! 🏆",
            conquista: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// CONQUISTAS — EDITAR
// =================================

app.put("/api/conquistas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            date
        } = req.body;

        if (!title || !description || !date) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Título, descrição e data são obrigatórios."
            });
        }

        const { data, error } = await supabase
            .from("conquistas")
            .update({
                title,
                description,
                category: category || "Outros",
                date,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro ao editar conquista:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao editar conquista.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Conquista editada com sucesso! ✏️",
            conquista: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// CONQUISTAS — EXCLUIR
// =================================

app.delete("/api/conquistas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("conquistas")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Erro ao excluir conquista:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao excluir conquista.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Conquista excluída com sucesso! 🗑️"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// PROJETOS — LISTAR
// =================================

app.get("/api/projetos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("projetos")
            .select("*")
            .order("updated_at", {
                ascending: false
            });

        if (error) {
            console.error("Erro ao buscar projetos:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar projetos.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            projetos: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// PROJETOS — CRIAR
// =================================

app.post("/api/projetos", async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            status,
            progress
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Título e descrição são obrigatórios."
            });
        }

        let projectProgress = Number(progress);

        if (isNaN(projectProgress) || projectProgress < 0) {
            projectProgress = 0;
        }

        if (projectProgress > 100) {
            projectProgress = 100;
        }

        const { data, error } = await supabase
            .from("projetos")
            .insert([
                {
                    title,
                    description,
                    category: category || "Outros",
                    status: status || "planning",
                    progress: projectProgress
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Erro ao criar projeto:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao criar projeto.",
                erro: error.message
            });
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Projeto criado com sucesso! 🚀",
            projeto: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// PROJETOS — EDITAR
// =================================

app.put("/api/projetos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            status,
            progress
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Título e descrição são obrigatórios."
            });
        }

        const progressValue = Math.min(
            100,
            Math.max(
                0,
                Number(progress) || 0
            )
        );

        const { data, error } = await supabase
            .from("projetos")
            .update({
                title,
                description,
                category: category || "Outros",
                status: status || "planning",
                progress: progressValue,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro ao editar projeto:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao editar projeto.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Projeto editado com sucesso! ✏️",
            projeto: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// PROJETOS — EXCLUIR
// =================================

app.delete("/api/projetos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("projetos")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Erro ao excluir projeto:", error);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao excluir projeto.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Projeto excluído com sucesso! 🗑️"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

// =================================
// INICIAR SERVIDOR
// =================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `NEXUS API rodando na porta ${PORT}`
    );
});