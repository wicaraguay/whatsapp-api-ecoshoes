import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if(this.isGreeting(incomingMessage)){
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        await this.sendWelcomeMenu(message.from);
      }else if(incomingMessage === 'media') {
        await this.sendMedia(message.from);
      }else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response, message.id);
      }
      await whatsappService.markAsRead(message.id);
    }else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.title.toLowerCase().trim();
      await this.handleMenuOption(message.from, option);
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas tardes"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Hola ${name.split(' ')[0]}, Bienvenido a ECO SHOES, Tu tienda de calzado en línea. ¿En qué puedo ayudarte hoy?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }
  async sendWelcomeMenu (to){
    const menuMessage = "Elige una opción:";
    const buttons = [
      {
        type: 'reply', reply: {id: 'option_1', title: 'Ver catalogo'}
      },
      {
        type: 'reply', reply: {id: 'option_2', title: 'Consultar'}
      },
      {
        type: 'reply', reply: {id: 'option_3', title: 'Ubicacion'}
      }
    ]
    await whatsappService.sendInterativeButtons(to, menuMessage, buttons);
  }
  async handleMenuOption(to, option){
    let response;
    switch (option){
      case 'ver catalogo':
        response = "Ver catálogo";
        break;
      case 'consultar': 
        response = "Realiza tu Consultar";
        break;
      case 'ubicacion':
        response = "Esta es nuestra ubicación";
        break;
      default:
        response = "Lo siento no entendi tu seleccion. Por favor, elije una de la opciones del menu";
    }
    await whatsappService.sendMessage(to, response);  
  }
  async sendMedia(to){
    // const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac';
    // const caption = 'Bienvenida';
    // const type = 'audio';

    // const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png';
    // const caption = '¡Esto es una Imagen!';
    // const type = 'image';

    const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4';
    const caption = '¡Esto es una video!';
    const type = 'video';

    // const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
    // const caption = '¡Esto es un PDF!';
    // const type = 'document';
    await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
  }


}

export default new MessageHandler();