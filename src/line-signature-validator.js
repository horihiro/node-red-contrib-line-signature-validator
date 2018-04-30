import crypto from 'crypto';

export default (RED) => {
  const LINESignatureValidator = function LINESignatureValidator(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.on('input', (msg) => {
      const msgs = [msg, null];
      const body = msg.payload;
      const signature = crypto
        .createHmac('SHA256', config.channelSecret)
        .update(Buffer.from(JSON.stringify(body))).digest('base64');
      if (msg.req.headers['x-line-signature'] !== signature) msgs.reverse();
      node.send(msgs);
    });
  };
  RED.nodes.registerType('validator', LINESignatureValidator);
};
