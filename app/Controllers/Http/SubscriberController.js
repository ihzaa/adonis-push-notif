"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Subscriber = use("App/Models/Subscriber");
const { route } = require("@adonisjs/framework/src/Route/Manager");
const webpush = require("web-push");
const vapidKeys = {
  publicKey:
    "BNI7p_9nFWcVklOD3pIdDo9gWeNnhRXowMM18vYimRYhYn1cV-zOm7NYRpUVVFs2i52xFL0Ic9ZOmdiOk6dsd44",
  privateKey: "Xvyw9RUf32h1Blt9GmGRPcFhPgMzf_9GOxLiW-g990o",
};
webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
/**
 * Resourceful controller for interacting with subscribers
 */
class SubscriberController {
  /**
   * Show a list of all subscribers.
   * GET subscribers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  async create({ request, response, view }) {
    const subscribe = new Subscriber();
    subscribe.data = JSON.stringify(request.body);
    await subscribe.save();
    return JSON.stringify({
      status: 200,
      data: {
        id: subscribe.id,
        waktu: subscribe.created_at,
      },
    });
  }

  async sendNotification(subscription, dataToSend = "") {
    subscription.forEach(async (element) => {
      webpush
        .sendNotification(
          element[1],
          JSON.stringify({
            body: dataToSend,
            data: { url: "/" },
          })
        )
        .catch(async (err) => {
          if (err.statusCode == 410) {
            const del = await Subscriber.find(element[0]);
            await del.delete();
          }
        });
    });
  }

  async send({ request, response, view }) {
    const Sub = await Subscriber.all();
    let result = [];
    Sub.rows.forEach((element) => {
      result.push([element.id, JSON.parse(element.data)]);
    });
    this.sendNotification(result, "Halo ini pesan bos");
    return JSON.stringify({ status: 200, message: "OKEE" });
  }
}

module.exports = SubscriberController;
