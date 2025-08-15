import CryptoJS from 'crypto-js';

export class EncryptionUtils {
  private static generateKey(userId: string, vaultId: string, purpose: 'content' | 'share' = 'content'): string {
    const salt = `everkeep-${purpose}-${vaultId}`;
    const key = CryptoJS.PBKDF2(userId, salt, { keySize: 256 / 32, iterations: 1000 });
    return key.toString();
  }

  static encryptText(text: string, userId: string, vaultId: string): string {
    const key = this.generateKey(userId, vaultId, 'content');
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  static decryptText(encryptedText: string, userId: string, vaultId: string): string {
    const key = this.generateKey(userId, vaultId, 'content');
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  static encryptMediaData(mediaData: any, userId: string, vaultId: string): string {
    return this.encryptText(JSON.stringify(mediaData), userId, vaultId);
  }

  static decryptMediaData(encryptedData: string, userId: string, vaultId: string): any {
    const decryptedJson = this.decryptText(encryptedData, userId, vaultId);
    return JSON.parse(decryptedJson);
  }

  static generateShareToken(userId: string, vaultId: string): string {
    const shareKey = this.generateKey(userId, vaultId, 'share');
    const timestamp = Date.now().toString();
    const payload = JSON.stringify({ vaultId, timestamp, userId });
    const encrypted = CryptoJS.AES.encrypt(payload, shareKey).toString();
    return Buffer.from(encrypted).toString('base64').replace(/[+/=]/g, (char) => {
      switch (char) {
        case '+': return '-';
        case '/': return '_';
        case '=': return '';
        default: return char;
      }
    });
  }

  static verifyShareToken(token: string): { vaultId: string; userId: string } | null {
    try {
      const base64 = token.replace(/[-_]/g, (char) => char === '-' ? '+' : '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      const encrypted = Buffer.from(padded, 'base64').toString('utf8');
      return { vaultId: '', userId: '', encrypted } as any;
    } catch {
      return null;
    }
  }

  static isEncrypted(content: string): boolean {
    if (!content) return false;
    if (content.startsWith('U2FsdGVkX1') || content.includes('U2FsdGVkX1')) return true;
    const base64Like = /^[A-Za-z0-9+/=]+$/.test(content);
    return base64Like && content.length > 50;
  }

  static safeDecrypt(content: string, userId: string, vaultId: string): string {
    if (!content) return content;
    try {
      if (!this.isEncrypted(content)) return content;
      return this.decryptText(content, userId, vaultId) || content;
    } catch {
      return content;
    }
  }
}

export default EncryptionUtils; 