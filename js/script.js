const entradaTarefa = document.getElementById("taskInput");
const botaoAdicionar = document.getElementById("addTaskButton");
const listaTarefas = document.getElementById("taskList");

// Carregar tarefas do localStorage
function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    listaTarefas.innerHTML = ""; // Limpar lista
    tarefas.forEach((tarefa, indice) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${tarefa}</span>
            <button class="botao-excluir" onclick="excluirTarefa(${indice})">Excluir</button>
        `;
        listaTarefas.appendChild(li);
    });
}

// Adicionar nova tarefa
function adicionarTarefa() {
    const tarefa = entradaTarefa.value.trim();

    if (!tarefa) {
        // Exibir mensagem de erro se o campo estiver vazio
        alert("Erro: O campo de tarefa está vazio. Por favor, insira uma tarefa!");
        return;
    }

    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas.push(tarefa);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    // Exibir mensagem de confirmação
    alert("Tarefa adicionada com sucesso!");
    entradaTarefa.value = ""; // Limpar o campo de entrada
    carregarTarefas();
}

// Excluir tarefa
function excluirTarefa(indice) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas.splice(indice, 1);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    // Exibir mensagem de confirmação de exclusão
    alert("Tarefa excluída com sucesso!");
    carregarTarefas();
}

// Event Listeners
botaoAdicionar.addEventListener("click", adicionarTarefa);
document.addEventListener("DOMContentLoaded", carregarTarefas);