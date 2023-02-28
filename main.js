const user = require("./cmds_user.js");
const quiz = require("./cmds_quiz.js");
const favs = require("./cmds_favs.js");
const readline = require("readline");

//Importamos el modulo net
let net = require("net");

//Puero en el que opera el servidor
let puerto = 8080;

//Creacion del socket de servidor -- con el manejador de conexiones y eventos
let servidor = net.createServer((socket) => {
  
  //Creamos el interfaz de entrada y salida de datos con el mismo socket
  const rl = readline.createInterface({
    input: socket,
    output: socket,
    prompt: "> ",
  });
  rl.log = (msg) => socket.write(msg); // Add log to rl interface
  rl.questionP = function (string) {
    // Add questionP to rl interface
    return new Promise((resolve) => {
      this.question(`  ${string}: `, (answer) => resolve(answer.trim()));
    });
  };

  rl.prompt();

  //Manejador del evento 'line'
  rl.on("line", async (line) => {
    try {
      let cmd = line.trim();

      if ("" === cmd) {} 
      else if ("h" === cmd) {user.help(rl);} 
      else if (["lu", "ul", "u"].includes(cmd)) {await user.list(rl);} 
      else if (["cu", "uc"].includes(cmd)) {await user.create(rl);} 
      else if (["ru", "ur", "r"].includes(cmd)) {await user.read(rl);} 
      else if (["uu"].includes(cmd)) {await user.update(rl);} 
      else if (["du", "ud"].includes(cmd)) {await user.delete(rl);}

      else if (["lq", "ql", "q"].includes(cmd)) {await quiz.list(rl);}
      else if (["cq", "qc"].includes(cmd)) {await quiz.create(rl);} 
      else if (["tq", "qt", "t"].includes(cmd)) {await quiz.test(rl);} 
      else if (["uq", "qu"].includes(cmd)) {await quiz.update(rl);} 
      else if (["dq", "qd"].includes(cmd)) {await quiz.delete(rl);}

      else if (["lf", "fl", "f"].includes(cmd)) {await favs.list(rl);} 
      else if (["cf", "fc"].includes(cmd)) {await favs.create(rl);} 
      else if (["df", "fd"].includes(cmd)) {await favs.delete(rl);}

      else if ("e" === cmd) {
        rl.log("Bye!");
        socket.destroy();
        console.log("Ckiente desconectado");
      } else {
        rl.log("UNSUPPORTED COMMAND!");
        user.help(rl);
      }
    } catch (err) {
      rl.log(`  ${err}`);
    } finally {
      rl.prompt();
    }
  });
});

//Se establece el puerto en el que va a escuchar las conexiones
servidor.listen(puerto);

//Mensaje por pantalla
console.log("Servidor arrancado y escuchando en el puerto: " + puerto);
