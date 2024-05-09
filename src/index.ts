import { WorkerEntrypoint } from "cloudflare:workers";

// NOTE: Overhead 検証に使った
// function sleep(time: number) {
//   return new Promise(resolve => setTimeout(resolve,time));
// }

// See: https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/
// export default class TestRpcService extends WorkerEntrypoint {
//   async getSomething() {
// 		return new Response("RPC desu!!!");
//   }
// };

export default class extends WorkerEntrypoint {
  // See: https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/#lifecycle-methods-ctx
  async #sendEvent() {
    try {
      const res =  await fetch("https://www.google.co.jp/", { method: "GET" });
      const json = await res.text();
      console.log(json);
      return res;
    } catch (e) {
      console.log(e)
    }
  }

  async fetch(request: Request) {
    try {
      // 呼び出し元のworkerが終了しても、こちらの処理は実行用にする記述
      this.ctx.waitUntil(this.#sendEvent())
      const url = request.url;
      console.log(url)
      return new Response(); 
    } catch(e) {
      console.log(e);
      return new Response();
    }
  }
}

