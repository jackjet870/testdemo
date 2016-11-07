using System;
using ArchPack.Tests.TestUnits.Helpers.V1;
using Xunit;
using ArchPack.ArchUnits.Cryptography.V1;

namespace ArchPack.Tests.ArchUnits.Cryptography.V1
{
    public class TripleDESCryptDataTest
    {        
        public TripleDESCryptDataTest()
        {
            ContainerHelper.InitializeDefault();
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Encrypt(string content)
        /// テスト内容　　　　   : URL パラメータ名は暗号化せず、URL パラメータの値のみを暗号化する
        /// 確認内容　　　　　　 : 指定された文字列が null の場合は、ArgumentNullException が発生すること         
        /// 確認内容　　　　　　 : エラーメッセージが「contentにnullまたは空文字を指定できません」となっていること
        /// </summary>
        [Fact]
        public void EncryptWithNullContentTest()
        {
            string content = null;
            ArgumentNullException ex = Assert.Throws<ArgumentNullException>(() => TripleDESCryptData.Encrypt(content));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("contentにnullを指定できません。", "content"), ex.Message);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Encrypt(string content)
        /// テスト内容　　　　   : URL パラメータ名は暗号化せず、URL パラメータの値のみを暗号化する
        /// 確認内容　　　　　　 : 指定された文字列が 空文字 の場合は、ArgumentException が発生すること
        /// 確認内容　　　　　　 : エラーメッセージが「contentにnullまたは空文字を指定できません」となっていること
        /// </summary>
        [Fact]
        public void EncryptWithEmptyContentTest()
        {
            string content = string.Empty;
            ArgumentException ex = Assert.Throws<ArgumentException>(() => TripleDESCryptData.Encrypt(content));
            Assert.Equal(UnitTestHelper.GetAugementMessage("contentに空文字を指定できません。", "content"), ex.Message);
        }


        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Encrypt(string content)
        /// テスト内容　　　　   : URL パラメータ名は暗号化せず、URL パラメータの値のみを暗号化する
        /// 確認内容　　　　　　 : 指定された文字列が トリプルDES で暗号化されること
        /// </summary>
        [Fact]
        public void EncryptContentTest()
        {
            string content = "B02F3854-9170-43E8-A14D-14F4309CDC6A";
            string result = TripleDESCryptData.Encrypt(content);
            Assert.Equal("UkoZbHdddKn/qCBGaSprVOg1hq0q9V9bl5oT62nREzYZNT4rCXXbIA==", result);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Encrypt(string content)
        /// テスト内容　　　　   : 暗号化されたパラメータは遷移先の画面で復号化できる
        /// 確認内容　　　　　　 : 指定された文字列で暗号化し、暗号化した結果を複合化した場合に、指定した文字列に複合化されてること
        /// </summary>
        [Fact]
        public void EncryptDecryptContentTest()
        {
            string content = "B02F3854-9170-43E8-A14D-14F4309CDC6A";
            string result = TripleDESCryptData.Encrypt(content);
            string resultDecrypt = TripleDESCryptData.Decrypt(result);
            Assert.Equal(content, resultDecrypt);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Decrypt(string content)
        /// テスト内容　　　　   : URL パラメータ名は復号化せず、URL パラメータの値のみを復号化する
        /// 確認内容　　　　　　 : 指定された文字列が null の場合は、ArgumentNullException が発生すること
        /// </summary>
        [Fact]
        public void DecryptWithNullContentTest()
        {
            string content = null;
            ArgumentNullException ex = Assert.Throws<ArgumentNullException>(() => TripleDESCryptData.Decrypt(content));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("contentにnullを指定できません。", "content"), ex.Message);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Decrypt(string content)
        /// テスト内容　　　　   : URL パラメータ名は復号化せず、URL パラメータの値のみを復号化する
        /// 確認内容　　　　　　 : 指定された文字列が 空文字 の場合は、ArgumentNullException が発生すること
        /// </summary>
        [Fact]
        public void DecryptWithEmptyContentTest()
        {
            string content = string.Empty;
            ArgumentException ex = Assert.Throws<ArgumentException>(() => TripleDESCryptData.Decrypt(content));
            Assert.Equal(UnitTestHelper.GetAugementMessage("contentに空文字を指定できません。", "content"), ex.Message);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Decrypt(string content)
        /// テスト内容　　　　   : URL パラメータ名は復号化せず、URL パラメータの値のみを復号化する
        /// 確認内容　　　　　　 : トリプルDESで暗号化された文字列を指定し、複合化されること
        /// </summary>
        [Fact]
        public void DecryptContentTest()
        {
            string content = "UkoZbHdddKn/qCBGaSprVOg1hq0q9V9bl5oT62nREzYZNT4rCXXbIA==";
            string result = TripleDESCryptData.Decrypt(content);
            Assert.Equal("B02F3854-9170-43E8-A14D-14F4309CDC6A", result);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Decrypt(string content)
        /// テスト内容　　　　   : 復号化に失敗した場合は、システムエラーとする
        /// 確認内容　　　　　　 : 複合化に失敗した場合は、CryptException が発生すること
        /// テスト内容　　　　   : エラーメッセージは「システムエラーが発生しました」とする
        /// 確認内容　　　　　　 : エラーメッセージが「システムエラーが発生しました」となっていること
        /// </summary>
        [Fact]
        public void DecryptWithFormatFailContentTest()
        {
            string content = "UkoZbHdddKn/qCBGaSprVOg1hq0q9V9bl5oT62nREzYZN";
            CryptException ex = Assert.Throws<CryptException>(() => TripleDESCryptData.Decrypt(content));
            Assert.Equal("システムエラーが発生しました。", ex.Message);
            Assert.NotNull(ex.InnerException);
            Assert.Equal("Base-64 文字配列または文字列の長さが無効です。", ex.InnerException.Message);
        }

        /// <summary>
        /// クラス　　　　　　　 : TripleDESCryptions 
        /// メソッド / プロパティ: Decrypt(string content)
        /// テスト内容　　　　   : 復号化までの期限を設けていない
        /// 確認内容　　　　　　 : 暗号化した文字列を複数回複合化しても毎回同じ結果が返却される
        /// </summary>
        [Fact]
        public void DecryptContentAt10TimeTest()
        {
            for (int i = 0; i < 10; i++)
            {
                string content = "UkoZbHdddKn/qCBGaSprVOg1hq0q9V9bl5oT62nREzYZNT4rCXXbIA==";
                string result = TripleDESCryptData.Decrypt(content);
                Assert.Equal("B02F3854-9170-43E8-A14D-14F4309CDC6A", result);
            }
            
        }
    }
}
