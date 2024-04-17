let orderCount = 0;
let botCount = 0;
let pendingOrders = [];
let processingOrders = [];
let completedOrders = [];
const botTimeouts = {};

function createOrder(type) {
  const order = {
    id: ++orderCount,
    type: type,
    status: "PENDING"
  };

  if (type === 'vip') {
    const vipIndex = pendingOrders.findIndex(order => order.type === 'normal');
    if (vipIndex !== -1) {
      pendingOrders.splice(vipIndex, 0, order);
    } else {
      pendingOrders.push(order);
    }
  } else {
    pendingOrders.push(order);
  }

  startOrders();
  processOrders();
}

function addBot() {
    botCount++;
    const botArea = document.getElementById('bot-area');
    const bot = document.createElement('div');
    bot.id = `bot-${botCount}`;
    bot.textContent = `Bot ${botCount}: IDLE`;
    botArea.appendChild(bot);
    processOrders();
}

function removeBot() {
    if (botCount > 0) {
        clearTimeout(botTimeouts[`bot-${botCount}`]);
        const botToRemove = document.getElementById(`bot-${botCount}`);
        botToRemove.parentNode.removeChild(botToRemove);

        const index = processingOrders.findIndex(order => order.status === `PROCESSING by BOT ${botCount}`);
        if (index !== -1) {
            const order = processingOrders.splice(index, 1)[0];
            order.status = "PENDING";
            pendingOrders.unshift(order);

            const processingOrdersElement = document.getElementById('processing-orders');
            processingOrdersElement.innerHTML = processingOrders.map(order => `<div>${order.type.toUpperCase()} Order ${order.id}: ${order.status}</div>`).join('');

            const pendingOrdersElement = document.getElementById('pending-orders');
            pendingOrdersElement.innerHTML = pendingOrders.map(order => `<div>${order.type.toUpperCase()} Order ${order.id}: ${order.status}</div>`).join('');
        }
        
        botCount--;
    }
}

function processOrders() {
    const botProcessingTime = 10000;

    if (botCount > 0 && pendingOrders.length > 0) {
        let idleBotId = null;
        for (let i = 1; i <= botCount; i++) {
            const botStatus = document.getElementById(`bot-${i}`).textContent;
            if (botStatus === `Bot ${i}: IDLE`) {
                idleBotId = i;
                break;
            }
        }

        if (idleBotId !== null) {
            document.getElementById(`bot-${idleBotId}`).textContent = `Bot ${idleBotId}: PROCESSING`;

            const order = pendingOrders.shift();
            order.status = `PROCESSING by BOT ${idleBotId}`;

            const processingOrdersElement = document.getElementById('processing-orders');
            const orderElement = document.createElement('div');
            orderElement.textContent = `${order.type.toUpperCase()} Order ${order.id}: ${order.status}`;
            processingOrdersElement.appendChild(orderElement);

            processingOrders.push(order);
            const pendingOrdersElement = document.getElementById('pending-orders');
            pendingOrdersElement.innerHTML = pendingOrders.map(order => `<div>${order.type.toUpperCase()} Order ${order.id}: ${order.status}</div>`).join('');

            botTimeouts[`bot-${idleBotId}`] = setTimeout(() => {
              if (document.getElementById(`bot-${idleBotId}`)) {
                  document.getElementById(`bot-${idleBotId}`).textContent = `Bot ${idleBotId}: IDLE`;
                  order.status = "COMPLETE";
                  processingOrders.shift();
                  completedOrders.push(order);
              }
              doOrders();
              processOrders();
          }, botProcessingTime);
        }
    }
}

  function startOrders() {
    const pendingOrdersElement = document.getElementById('pending-orders');
    pendingOrdersElement.innerHTML = pendingOrders.map(order => `<div>${order.type.toUpperCase()} Order ${order.id}: ${order.status}</div>`).join('');
  }

  function doOrders() {
    const processingOrdersElement = document.getElementById('processing-orders');
    const completedOrdersElement = document.getElementById('completed-orders');

    processingOrdersElement.innerHTML = processingOrders.map(order => `<div>${order.type.toUpperCase()} Order ${order.id}: ${order.status}</div>`).join('');
    completedOrdersElement.innerHTML = completedOrders.map(order => `<div>${order.type.toUpperCase()} Order ${order.id}: ${order.status}</div>`).join('');
  }
  
  
  

