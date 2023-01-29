import Web3 from "web3";
import  { Account as EthAccount} from "web3-core"

declare global {
  interface Window {
      $web3: Web3;
      ethereum: any;
  }
}

export class Web3Service { 
  web3: Web3;
  address: string;

  constructor() {
    this.web3 = new Web3(window.ethereum);
    this.address = "";
  }

  public connectWallet (callback: Function) {
    if (window.ethereum) {
      window.ethereum.enable().then((accounts: string[]) => {
        this.web3.eth.getBalance(accounts[0]).then((balance: string) => {
          this.address = accounts[0];
          callback(accounts[0], balance);
        });
      });
    }
  }

  public async currentNetworkId(): Promise<number> {
    return await this.web3.eth.getChainId();
  }

  public async currentNetworkType(): Promise<string> {
    return await this.web3.eth.net.getNetworkType();
  }

  public async sign(message: string) {
    if(this.address) {
      const sig: string = await this.web3.eth.sign(message, this.address, (ret: any) => {
        console.log("signed ret", ret)
      })
      return sig;
    }  
    return "";
  }


  public async signTypedData(data: Object): Promise<string> {
    if(this.address) {
      const sig: string = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [
          this.address,
          JSON.stringify(data)
        ]
      });
      console.log('signTypedData - sig:', sig);
      return sig;
    }
    return "";
  }

  public async create(): Promise<EthAccount> {
    const account = this.web3.eth.accounts.create()
    return account;
  }

}