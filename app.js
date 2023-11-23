$(function () {
  // Obtener todas las cartas de la parte inferior
  var cartasInferiores = $(".carta", "#contenedor-inferior");
  var cartasSuperiores = $(".carta", "#contenedor-superior");

  // Barajar las cartas de forma aleatoria
  shuffleCartas(cartasInferiores);

  // Hacer las cartas inferiores arrastrables
  cartasInferiores.draggable({
    revert: "invalid",
    snap: "#contenedor-superior",
    snapMode: "inner",
    start: function (event, ui) {
      // Verificar si la carta está dentro del contenedor inferior
      if (!$(this).closest("#contenedor-inferior").length) {
        return false; // Evitar que la carta se mueva si no está en el contenedor inferior
      }
    }
  });

  // Agregar variable para contar los aciertos
  var aciertos = 0;

  // Hacer el contenedor superior un área donde se pueden soltar las cartas
  $("#contenedor-superior").droppable({
    accept: ".carta",
    drop: function (event, ui) {
      var droppedElement = ui.helper;
      var dropX = event.pageX - $(this).offset().left;
      var dropY = event.pageY - $(this).offset().top;
      var newPosition = findClosestContainer(dropX, dropY);
      var cartaId = "#carta-superior-" + newPosition;

      // Verificar si la posición superior ya tiene una carta asociada
      if (!$(cartaId).hasClass("ocupada")) {
        // Marcar la posición superior como ocupada
        $(cartaId).addClass("ocupada");

        // Agregar clase a la carta movida con el número de posición
        droppedElement.addClass("carta-inferior-" + newPosition);

        // Reproducir el sonido
        $("#sonidoCarta")[0].play();
        // Mover la carta inferior a la posición superior
        droppedElement.remove();
        $(cartaId).html(droppedElement.html());



        // Mostrar mensaje con la información de la carta movida
        //var mensaje = "Carta con la clase " + droppedElement.attr("class") + " movida a la carta superior con id " + cartaId;
        //$("#mensaje").text(mensaje).show();

        // Obtener el número de posición de la carta inferior
        var numeroCartaInferior = droppedElement.attr("id").split('-').pop();

        // Obtener el número de posición de la carta superior desde el ID
        var numeroCartaSuperior = cartaId.split("-").pop(); // Obtener el último segmento del ID, que debería ser el número

        if (numeroCartaInferior === numeroCartaSuperior) {
          aciertos++;
        }

      } else {
        // Si la posición superior está ocupada, revertir la carta a su posición original
        ui.helper.animate({
          top: 0,
          left: 0
        }, "slow");
      }
    }
  });

  // Agregar evento de clic al botón de verificar
  $("#verificarBtn").on("click", function () {
    // Verificar si todas las cartas inferiores se han movido
    var ganaste = (aciertos === 4);
    mostrarModal(ganaste);
  });

  // Función para mostrar el modal con el mensaje correspondiente
  function mostrarModal(ganaste) {
    var mensaje = ganaste ? "¡Felicitaciones, ganaste!" : "¡Ups, perdiste!";
    $("#mensajeModal").text(mensaje);
    $("#modal").css("display", "block");

    // Reproducir sonido correspondiente
    var sonido = ganaste ? "images/GANAR.mp3" : "images/PERDER.mp3";  // Cambia con los nombres de tus archivos de sonido
    $("#sonidoResultado").attr("src", sonido);
    $("#sonidoResultado")[0].play();


    // Configurar eventos de clic en los botones dentro del modal
    $(".close").on("click", cerrarModal);
    $("button:contains('Intentarlo de nuevo')").on("click", reiniciarJuego);
  }

  // Función para cerrar el modal
  function cerrarModal() {
    $("#modal").css("display", "none");
  }

  // Función para reiniciar el juego
  function reiniciarJuego() {
    // Aquí puedes reiniciar el juego, por ejemplo, recargando la página
    location.reload();
  }

  // Función para barajar las cartas de forma aleatoria
  function shuffleCartas(cartas) {

    cartas.each(function (index) {
      $(this).data("posicion-original", index + 1);
    });

    for (var i = cartas.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = cartas[i];
      cartas[i] = cartas[j];
      cartas[j] = temp;
    }
    // Agregar las cartas barajadas al contenedor inferior
    cartas.each(function (index) {
      $(this).appendTo("#contenedor-inferior");
    });
  }

  // Función para encontrar el contenedor superior más cercano en función de las coordenadas
  function findClosestContainer(x, y) {
    var containers = $(".carta", "#contenedor-superior");
    var minDistance = Number.MAX_VALUE;
    var closestContainer = 1;

    containers.each(function (index) {
      var containerX = $(this).offset().left;
      var containerY = $(this).offset().top;
      var distance = Math.sqrt((x - containerX) ** 2 + (y - containerY) ** 2);

      if (distance < minDistance) {
        minDistance = distance;
        closestContainer = index + 1;
      }
    });

    return closestContainer;
  }
});
