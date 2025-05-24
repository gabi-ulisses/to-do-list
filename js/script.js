const entradaTarefa = document.getElementById("tituloInput");
const descricaoTarefa = document.getElementById("descricaoInput");
const botaoAdicionar = document.getElementById("addTaskButton");

function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");

    // Limpar colunas
    document.getElementById("lista-afazer").innerHTML = "";
    document.getElementById("lista-progresso").innerHTML = "";
    document.getElementById("lista-concluido").innerHTML = "";

    tarefas.forEach((tarefa, indice) => {
        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
            <div class="card-body p-2">
                <h5 class="card-title mb-1" style="text-decoration: ${tarefa.concluida ? "line-through" : "none"}">
                    ${tarefa.titulo}
                </h5>
                <p class="card-text small">${tarefa.descricao}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="editarTarefa(${indice})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirTarefa(${indice})"><i class="fas fa-trash"></i></button>
                    </div>
                    <div>
                        <input type="checkbox" class="form-check-input" ${tarefa.concluida ? "checked" : ""} onchange="alternarConclusao(${indice})">
                    </div>
                </div>
            </div>
        `;

        if (tarefa.status === 0) {
            document.getElementById("lista-afazer").appendChild(card);
        } else if (tarefa.status === 1) {
            document.getElementById("lista-progresso").appendChild(card);
        } else {
            document.getElementById("lista-concluido").appendChild(card);
        }
    });
}

function salvarEstado() {
    const listas = ['lista-afazer', 'lista-progresso', 'lista-concluido'];
    const tarefasSalvas = [];

    listas.forEach((idLista, index) => {
        const lista = document.getElementById(idLista);
        [...lista.children].forEach(card => {
            const titulo = card.querySelector('.card-title').textContent.trim();
            const descricao = card.querySelector('.card-text').textContent.trim();
            const concluida = (idLista === 'lista-concluido');
            tarefasSalvas.push({ titulo, descricao, concluida, status: index });
        });
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefasSalvas));
}

function adicionarTarefa() {
    const titulo = entradaTarefa.value.trim();
    const descricao = descricaoTarefa.value.trim();
    const mensagem = document.getElementById("mensagem");

    if (!titulo) {
        Swal.fire("Erro", "O campo de título está vazio. Por favor, insira um título!", "error");
        return;
    }

    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas.push({ titulo: titulo, descricao: descricao, concluida: false, status: 0 }); // status 0 = A Fazer
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    entradaTarefa.value = "";
    descricaoTarefa.value = "";
    carregarTarefas();

    mensagem.textContent = "Tarefa adicionada com sucesso!";
    mensagem.classList.add("mostrar");
    setTimeout(() => mensagem.classList.remove("mostrar"), 3000);
}

function excluirTarefa(indice) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você realmente quer excluir esta tarefa?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
            tarefas.splice(indice, 1);
            localStorage.setItem("tarefas", JSON.stringify(tarefas));
            carregarTarefas();
            Swal.fire('Excluída!', 'A tarefa foi excluída.', 'success');
        }
    });
}

function alternarConclusao(indice) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas[indice].concluida = !tarefas[indice].concluida;
    tarefas[indice].status = tarefas[indice].concluida ? 2 : 0; // concluído ou a fazer
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    carregarTarefas();
}


botaoAdicionar.addEventListener("click", adicionarTarefa);
document.addEventListener("DOMContentLoaded", () => {
    carregarTarefas();

    // Inicializa SortableJS nas listas para drag and drop
    const listas = ['lista-afazer', 'lista-progresso', 'lista-concluido'];
    listas.forEach(id => {
        new Sortable(document.getElementById(id), {
            group: 'tarefas',
            animation: 150,
            onEnd: () => {
                salvarEstado();
            },
        });
    });
});

let indiceEdicaoAtual = null;

function editarTarefa(indice) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    const tarefa = tarefas[indice];

    document.getElementById("editTitulo").value = tarefa.titulo;
    document.getElementById("editDescricao").value = tarefa.descricao;
    indiceEdicaoAtual = indice;

    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
}

function salvarEdicao() {
    const tituloEditado = document.getElementById("editTitulo").value.trim();
    const descricaoEditada = document.getElementById("editDescricao").value.trim();

    if (!tituloEditado) {
        Swal.fire("Erro", "Título não pode ficar vazio", "error");
        return;
    }

    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas[indiceEdicaoAtual].titulo = tituloEditado;
    tarefas[indiceEdicaoAtual].descricao = descricaoEditada;
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    carregarTarefas();

    const modalElement = document.getElementById("modalEditar");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    Swal.fire("Sucesso", "Tarefa atualizada!", "success");
}