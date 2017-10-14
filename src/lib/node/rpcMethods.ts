import { generateTxObj, JSONPostParser, JSONErrorHandler } from './JSONCalls'

const sendRawTransaction = (tx: String): IMethodAndParams => ({
    method: 'eth_sendRawTransaction',
    params: tx
})

const ethCall = (call: IInputMappings): IOutputMappings => {
    method: 'eth_call',
    params: call.params
    let req = fetch(<RequestInfo> call.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.decorateRequest(Request))
      })
      .then(r => {return r.json()});

}

export const rpcMethods = {
    ethCall,
    sendRawTransaction
}

export const rerouteRPCMethodsHandler = (obj) => {
    const rerouteRPC = {
        get(node, propKey) {
            const rpcMethod = rpcMethods[propKey]
            const nodeMethod = node[propKey]
            if (!rpcMethod && !nodeMethod) {
                throw Error(`${propKey} is not an RPC or Node method`)
            }
            if (nodeMethod) {
                const result = (...args) => nodeMethod.apply(node, args)
                return result
            } else {
                return (...args) => {
                    const call = rpcMethod(...args)
                    const rpcObj: IRPCRequestObj = {
                        txObj: generateTxObj(call),
                        parser: JSONPostParser(call.parser),
                        errorHandler: JSONErrorHandler(call.errorHandler)
                    }
                    return node.sendRPCRequest.call(node, rpcObj)
                }
            }
        }
    }
    return new Proxy(obj, rerouteRPC)
}