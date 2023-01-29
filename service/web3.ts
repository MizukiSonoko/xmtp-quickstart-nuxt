import Web3 from "web3";

declare global {
  interface Window {
      $web3: Web3;
      ethereum: any;
  }
}

export class Signer {
  web3: Web3;
  address: string;

  constructor() {
    this.web3 = new Web3(window.ethereum);
    this.address = "";
  }

  public connectWallet (callback: Function) {
    if (window.ethereum) {
      window.ethereum.enable().then((accounts: string[]) => {
        this.web3.eth.getBalance(accounts[0]).then(() => {
          this.address = accounts[0];
          callback(accounts[0]);
        });
      });
    }
  }

  // Not used in this repo. but it needs for satisfying Singer interfaces.
  public async getAddress(): Promise<string> {
    return this.address
  }

  public async signMessage(message: ArrayLike<number> | string): Promise<string>{
    if(typeof message === "string"){
      const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
      const sig = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, this.address, 'Example password'],
      });
      /*
      // Not Work in Metamask Provider
      //  ref: https://github.com/web3/web3.js/issues/4780
      //  ref: https://docs.metamask.io/guide/signing-data.html#signtypeddata-v4
      const sig: string = await this.web3.eth.sign(message, this.address, (ret: any) => {
        console.log("signed ret", ret)
      })
      */
      return sig;  
    } else {
      const strMsg: string = new TextDecoder().decode(Uint8Array.from(message));
      const sig: string = await this.web3.eth.sign(strMsg, this.address, (ret: any) => {
        console.log("signed strMsg ret", ret)
      })
      return sig;
    }
  }
}
