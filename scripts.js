const url = "https://api.groq.com/openai/v1/chat/completions"; 
const chave = "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"; // sua chave Groq

let botao = document.querySelector(".botao");
let caixaresposta = document.querySelector(".caixaresposta");
let resultado = document.querySelector(".resultado");

botao.addEventListener("click", gerarCodigo);

async function gerarCodigo() {
    try {
        let texto = document.querySelector(".caixatexto").value;

        if (!texto) {
            caixaresposta.textContent = "Digite algo primeiro.";
            return;
        }

        caixaresposta.textContent = "Gerando código...";
        resultado.srcdoc = "";

        let resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${chave}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "user", content: texto + "\nResponda apenas com código HTML/CSS/JS válido, sem explicações." }
                ],
                temperature: 1,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null
            })
        });

        if (!resposta.ok) {
            let erroTexto = await resposta.text();
            throw new Error("Erro API: " + resposta.status + " - " + erroTexto);
        }

        let dados = await resposta.json();

        // Pega o conteúdo retornado
        let codigoGerado = dados.choices[0].message.content;

        // Se vier dentro de blocos ```html ... ```
        let match = codigoGerado.match(/```(?:html|css|javascript)?([\s\S]*?)```/);
        if (match) {
            codigoGerado = match[1].trim();
        }

        // Mostra o código bruto na caixa de resposta (lado esquerdo)
        caixaresposta.textContent = codigoGerado;

        // Renderiza no iframe (lado direito)
        resultado.srcdoc = codigoGerado;

    } catch (erro) {
        console.error(erro);
        caixaresposta.textContent = "Erro: " + erro.message;
    }
}
