const prompt = require('prompt');

const addToIpParts = (ipParts,count,startOnPart = 3) => {
    ipParts[startOnPart] += count;
    if(ipParts[startOnPart] > 255){
        const diff = Math.ceil((ipParts[startOnPart] - 255) / 255);
        ipParts[startOnPart] -= diff * 255 + 1;
        return addToIpParts(ipParts,diff,startOnPart - 1);
    }
    return ipParts;
}

const addToIp = (ip,count) => {
    return addToIpParts(ip.split(".").map((item) => parseInt(item)),count).join(".");
}

prompt.start();

prompt.get(['network_address_block', 'subnet_mask','no_of_hosts_over_subnet','number_of_subnets'], function (err, result) {
    if (err) {
        return onErr(err);
    }
    let values = [];
    let ip = result.network_address_block.split("/")[0];
    for (let i = 0; i < result.number_of_subnets; i++) {
        const rangeLength = result.no_of_hosts_over_subnet - 2;
        const minRange = addToIp(ip,1);
        const maxRange = addToIp(ip,rangeLength);
        const range = `${minRange} - ${maxRange}`
        const broadCast = addToIp(maxRange,1);
        values.push({
            "Subnet Address" : ip,
            "Host Address Range" : range,
            "Broadcast Address" : broadCast,
        });
        ip = addToIp(broadCast,1);
    }
    console.table(values);
});

function onErr(err) {
    console.log(err);
    return 1;
}