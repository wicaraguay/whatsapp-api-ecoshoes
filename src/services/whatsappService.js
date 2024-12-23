import axios from 'axios';
import config from '../config/env.js';

class WhatsAppService {
  async sendMessage(to, body, messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          text: { body },
          // context: {
          //   message_id: messageId,
          // },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async markAsRead(messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async sendInterativeButtons(to, BodyText, buttons) {
    try{
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {text: BodyText},
            action:{buttons: buttons}
          },
        },
      });
    }catch (error) {
      console.error(error);
    }
  }

  async sendMediaMessage (to, type, media_URL, caption){
    try{
      const mediaObject = {};

      switch (type){
        case 'image':
          mediaObject.image = {link: media_URL, caption: caption};
          break;
        case 'audio':
          mediaObject.audio = {link: media_URL};
          break;
        case 'video':
          mediaObject.video = {link: media_URL, caption: caption};
          break;
        case 'document':
          mediaObject.document = {link: media_URL, caption: caption, filename:'medpet-file.pdf'};
          break;
          default:
            throw new Error('Not soported media type');
      }
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          type: type,
          ...mediaObject
        },
      })


    }catch (error){
      console.error('Error sending media',error);
    }
  }
}

export default new WhatsAppService();