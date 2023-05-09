const User = require('./../Models/userModel');
const HalfSignTrans = require('./../Models/halfSignedTrans');
const appError = require('./../utilities/appError');
const HalfTrans = require('./../Models/halfSignedTrans');
const Chain = require('./../Models/chainModel');
const catchAsync = require('../utilities/catchAsync');
const { sardarCoin, Transactions } = require('./../Blockchain/blockchain');
const fs = require('fs');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

exports.toFromSignature = catchAsync(async (req, res, next) => {
  const fromUser = await User.findOne({ publicKey: req.body.fromPublicKey });
  const toUser = await User.findOne({ publicKey: req.body.toPublicKey });

  if (!fromUser && !toUser) {
    next(new appError('Please input correct public address', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const fromPrivateKey = atob(fromUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const toPrivateKey = atob(toUser.privateKey);

  // Genrating Key Objects
  const fromKey = ec.keyFromPrivate(fromPrivateKey);
  const toKey = ec.keyFromPrivate(toPrivateKey);

  // console.log(fromKey.getPublic('hex'));
  // console.log(fromUser.publicKey);
  // console.log(atob(fromUser.privateKey));
  // console.log(fromPrivateKey);

  // console.log(toKey.getPublic('hex'));
  // console.log(toUser.publicKey);
  // console.log(atob(toUser.privateKey));
  // console.log(toPrivateKey);

  //Converting Plain TEXT into Base64
  const encryptedStamp = btoa(req.body.stampDetail);

  // Transcation
  const tx1 = new Transactions(
    fromKey.getPublic('hex'),
    toKey.getPublic('hex'),
    encryptedStamp,
    req.body.stampName
  );

  fromUser.publicKey = fromKey.getPublic('hex');
  toUser.publicKey = toKey.getPublic('hex');

  await fromUser.save({
    validateBeforeSave: false,
  });
  await toUser.save({
    validateBeforeSave: false,
  });

  //Signature of First 2 persons

  tx1.signFromTransaction(fromKey);
  tx1.signToTransaction(toKey);

  const trans = await HalfTrans.create({ transaction: tx1 });

  if (!trans) {
    next(
      new appError('Something is very Wrong in Blockchain While Signing', 500)
    );
  }

  res.status(200).json({
    status: 'success',

    data: {
      trans,
      Status: 'Tansacrtion Signed',
    },
  });
});

exports.V1Signature = catchAsync(async (req, res, next) => {
  const v1 = await User.findOne({ publicKey: req.params.pk });
  const halfTrans = await HalfSignTrans.findById(req.params.id);
  console.log(halfTrans);
  if (!v1) {
    next(new appError('Please input correct public address', 404));
  }
  if (!halfTrans) {
    next(new appError('Transcation you Trying to Sign DOes Not Exist', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const v1PrivateKey = atob(v1.privateKey);

  // Genrating Key Objects
  const v1Key = ec.keyFromPrivate(v1PrivateKey);

  // console.log('hexString', hexString);
  const fromUser = await User.findOne({
    publicKey: halfTrans.transaction.fromAddress,
  });
  const toUser = await User.findOne({
    publicKey: halfTrans.transaction.toAddress,
  });

  console.log(fromUser, toUser);
  if (!fromUser || !toUser) {
    next(new appError('Please input correct public address', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const fromPrivateKey = atob(fromUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const toPrivateKey = atob(toUser.privateKey);

  const fromKey = ec.keyFromPrivate(fromPrivateKey);
  const toKey = ec.keyFromPrivate(toPrivateKey);

  const tx1 = new Transactions(
    halfTrans.transaction.fromAddress,
    halfTrans.transaction.toAddress,
    halfTrans.transaction.stampDetail,
    halfTrans.transaction.stampName
  );

  tx1.signFromTransaction(fromKey);
  tx1.signToTransaction(toKey);
  tx1.signV1Transaction(v1Key);

  const trans = await HalfTrans.findByIdAndUpdate(req.params.id, {
    transaction: tx1,
  });

  if (!trans) {
    next(
      new appError('Something is very Wrong in Blockchain While Signing', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      trans,
      Status: 'Tansacrtion Signed',
    },
  });
});
exports.V2Signature = catchAsync(async (req, res, next) => {
  const v2 = await User.findOne({ publicKey: req.params.pk });
  const halfTrans = await HalfSignTrans.findById(req.params.id);

  if (!v2) {
    next(new appError('Please input correct public address', 404));
  }
  if (!halfTrans) {
    next(new appError('Transcation you Trying to Sign DOes Not Exist', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const v2PrivateKey = atob(v2.privateKey);

  // Genrating Key Objects

  const v2Key = ec.keyFromPrivate(v2PrivateKey);

  // console.log('hexString', hexString);
  const fromUser = await User.findOne({
    publicKey: halfTrans.transaction.fromAddress,
  });
  const toUser = await User.findOne({
    publicKey: halfTrans.transaction.toAddress,
  });

  const v1 = await User.findOne({
    publicKey: halfTrans.transaction.v1publicKey,
  });

  if (!fromUser || !toUser || !v1) {
    next(new appError('Please input correct public address', 404));
  }
  console.log(fromUser, toUser, v1);

  //converting base64 Private key into HEX of FROM ADDRESS
  const fromPrivateKey = atob(fromUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const toPrivateKey = atob(toUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const v1PrivateKey = atob(v1.privateKey);

  // halfTrans.transaction.signFromTransaction(v1Key);
  // halfTrans.transaction = new Transactions();
  // console.log(halfTrans.transaction);

  const fromKey = ec.keyFromPrivate(fromPrivateKey);
  const toKey = ec.keyFromPrivate(toPrivateKey);
  const v1Key = ec.keyFromPrivate(v1PrivateKey);

  const tx1 = new Transactions(
    halfTrans.transaction.fromAddress,
    halfTrans.transaction.toAddress,
    halfTrans.transaction.stampDetail,
    halfTrans.transaction.stampName
  );

  tx1.signFromTransaction(fromKey);
  tx1.signToTransaction(toKey);
  tx1.signV1Transaction(v1Key);
  tx1.signV2Transaction(v2Key);

  // savjeeCoin.addTransaction(tx1);
  // console.log(tx1);

  const trans = await HalfTrans.findByIdAndUpdate(req.params.id, {
    transaction: tx1,
  });

  if (!trans) {
    next(
      new appError('Something is very Wrong in Blockchain While Signing', 500)
    );
  }

  //   let { privateKey } = req.body;

  //   if (!privateKey) {
  //     return next(new appError('Please enter private keys', 500));
  //   }

  //  const binaryString = Buffer.from(user.privateKey, 'base64').toString(
  //     'binary'
  //   );
  //   const hexString = Buffer.from(binaryString, 'binary').toString('hex');

  //   console.log(hexString); // Output: "48656c6c6f"

  res.status(200).json({
    status: 'success',
    // length: user.length,
    data: {
      trans,
      Status: 'Tansacrtion Signed',
    },
  });
});

exports.lawyerSignature = catchAsync(async (req, res, next) => {
  const lawyer = await User.findOne({ publicKey: req.params.pk });
  const halfTrans = await HalfSignTrans.findById(req.params.id);

  if (!lawyer && lawyer.role != lawyer) {
    next(new appError('Please input correct public address', 404));
  }
  if (!halfTrans) {
    next(new appError('Transcation you Trying to Sign DOes Not Exist', 404));
  }

  if (Object.keys(halfTrans.transaction).length < 9) {
    next(new appError('Please Put Signature of all Parties First', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const lawyerPrivateKey = atob(lawyer.privateKey);

  // Genrating Key Objects

  const lawyerKey = ec.keyFromPrivate(lawyerPrivateKey);

  // console.log('hexString', hexString);
  const fromUser = await User.findOne({
    publicKey: halfTrans.transaction.fromAddress,
  });
  const toUser = await User.findOne({
    publicKey: halfTrans.transaction.toAddress,
  });

  const v1 = await User.findOne({
    publicKey: halfTrans.transaction.v1publicKey,
  });
  const v2 = await User.findOne({
    publicKey: halfTrans.transaction.v2publicKey,
  });

  if (!fromUser && !toUser && !v1 && !v2) {
    next(new appError('Please input correct public address', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const fromPrivateKey = atob(fromUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const toPrivateKey = atob(toUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const v1PrivateKey = atob(v1.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const v2PrivateKey = atob(v2.privateKey);

  // halfTrans.transaction.signFromTransaction(v1Key);
  // halfTrans.transaction = new Transactions();
  // console.log(halfTrans.transaction);

  const fromKey = ec.keyFromPrivate(fromPrivateKey);
  const toKey = ec.keyFromPrivate(toPrivateKey);
  const v1Key = ec.keyFromPrivate(v1PrivateKey);
  const v2Key = ec.keyFromPrivate(v2PrivateKey);

  const tx1 = new Transactions(
    halfTrans.transaction.fromAddress,
    halfTrans.transaction.toAddress,
    halfTrans.transaction.stampDetail,
    halfTrans.transaction.stampName
  );

  tx1.signFromTransaction(fromKey);
  tx1.signToTransaction(toKey);
  tx1.signV1Transaction(v1Key);
  tx1.signV2Transaction(v2Key);
  tx1.signLawyerTransaction(lawyerKey);

  // savjeeCoin.addTransaction(tx1);
  // console.log(tx1);

  const trans = await HalfTrans.findByIdAndUpdate(req.params.id, {
    transaction: tx1,
  });

  if (!trans) {
    next(
      new appError('Something is very Wrong in Blockchain While Signing', 500)
    );
  }

  //   let { privateKey } = req.body;

  //   if (!privateKey) {
  //     return next(new appError('Please enter private keys', 500));
  //   }

  //  const binaryString = Buffer.from(user.privateKey, 'base64').toString(
  //     'binary'
  //   );
  //   const hexString = Buffer.from(binaryString, 'binary').toString('hex');

  //   console.log(hexString); // Output: "48656c6c6f"

  res.status(200).json({
    status: 'success',
    // length: user.length,
    data: {
      trans,
      Status: 'Tansacrtion Signed',
    },
  });
});

exports.halfTrans = catchAsync(async (req, res, next) => {
  const halfSign = await HalfSignTrans.find();

  if (!halfSign) {
    next(new appError('No Record Found', 404));
  }

  res.status(200).json({
    status: 'success',

    length: halfSign.length,
    data: {
      halfSign,
    },
  });
});

exports.addTransaction = catchAsync(async (req, res, next) => {
  // let sardarCoin = new Blockchain();
  // for (let index = 2; index > 0; index--) {
  let halfTrans = await HalfSignTrans.findById(req.params.pk);
  // halfTrans = halfTrans[halfTrans.length - 1];

  if (!halfTrans) {
    next(
      new appError(
        'Transcation you Trying to Sign DOes Not Exist or Transaction Pool ismaybe Emptyy',
        404
      )
    );
  }

  // if (
  //   Object.keys(halfTrans.transaction).length < 12 ||
  //   halfTrans.transaction.stampDetail == undefined ||
  //   halfTrans.transaction.stampName == undefined
  // ) {
  //   const transs = await HalfSignTrans.deleteOne({ _id: halfTrans._id });
  //   if (transs) {
  //     next(new appError('invalid Transaction \n Transaction deleted', 404));
  //   }

  //   console.log('Length Trnas', Object.keys(halfTrans.transaction).length);
  // }
  // console.log('Length', Object.keys(halfTrans.transaction).length);

  const fromUser = await User.findOne({
    publicKey: halfTrans.transaction.fromAddress,
  });
  const toUser = await User.findOne({
    publicKey: halfTrans.transaction.toAddress,
  });

  const v1 = await User.findOne({
    publicKey: halfTrans.transaction.v1publicKey,
  });
  const v2 = await User.findOne({
    publicKey: halfTrans.transaction.v2publicKey,
  });
  const lawyer = await User.findOne({
    publicKey: halfTrans.transaction.LawyerPublic,
  });

  if (!fromUser && !toUser && !v1 && !v2 && !lawyer) {
    next(new appError('something is verWrong in adding transaaction', 404));
  }

  //converting base64 Private key into HEX of FROM ADDRESS
  const fromPrivateKey = atob(fromUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const toPrivateKey = atob(toUser.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const v1PrivateKey = atob(v1.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const v2PrivateKey = atob(v2.privateKey);

  //converting base64 Private key into HEX of TO ADDRESS
  const lawyerPrivateKey = atob(lawyer.privateKey);

  // halfTrans.transaction.signFromTransaction(v1Key);
  // halfTrans.transaction = new Transactions();
  // console.log(halfTrans.transaction);

  const fromKey = ec.keyFromPrivate(fromPrivateKey);
  const toKey = ec.keyFromPrivate(toPrivateKey);
  const v1Key = ec.keyFromPrivate(v1PrivateKey);
  const v2Key = ec.keyFromPrivate(v2PrivateKey);
  const lawyerKey = ec.keyFromPrivate(lawyerPrivateKey);

  const tx1 = new Transactions(
    halfTrans.transaction.fromAddress,
    halfTrans.transaction.toAddress,
    halfTrans.transaction.stampDetail,
    halfTrans.transaction.stampName
  );

  tx1.signFromTransaction(fromKey);
  tx1.signToTransaction(toKey);
  tx1.signV1Transaction(v1Key);
  tx1.signV2Transaction(v2Key);
  tx1.signLawyerTransaction(lawyerKey);

  sardarCoin.addTransaction(tx1);

  halfTrans.status = 'Minted';
  await halfTrans.save({
    validateBeforeSave: false,
  });

  // const transs = await HalfSignTrans.deleteOne({ _id: halfTrans._id });
  // if (!transs) {
  //   next(
  //     new appError('Somthing is getting wrong while minting your Stamp', 404)
  //   );
  // }

  console.log('Pending Trnasactions', sardarCoin.pendingTransactions);

  res.status(200).json({
    status: 'success',
    transaction: halfTrans,

    data: {
      Message:
        'Your Stamp will be minted Blockchain as soon as possible.. depending on network traffic',
    },
  });
});

exports.minigTransactions = catchAsync(async (req, res, next) => {
  // console.log(sardarCoin);
  const publicKey = req.params.pk;
  sardarCoin.minePendingTrasactions(publicKey);
  const balance = sardarCoin.getBalanceOfAddress(publicKey);

  // const chain = await Chain.create({ chain: sardarCoin.chain });
  // const chain = await Chain.findOneAndReplace(
  //   { _id: '63ff77e7a2110bcaacc032b0' },
  //   { chain: sardarCoin.chain }
  // );
  // console.log(sardarCoin.chain);
  // console.log(chain);

  const chainget = await Chain.find();
  res.status(200).json({
    status: 'success',

    data: {
      Message: 'Transaction is minted on blockchhain',
      // Message: chain,
    },
  });
});

exports.findingTransactions = catchAsync(async (req, res, next) => {
  // const stamps = sardarCoin.getStampsOfAddress(req.params.pk);
  // stamps.forEach((a) => {
  //   a.stampDetail = atob(a.stampDetail);
  // });

  const halfTrans = await HalfSignTrans.find({ status: 'Minted' });
  if (!halfTrans) {
    next(new appError('You Dont have any Transaction Yet', 404));
  }

  // let a = halfTrans.map((x)=>
  // x.transaction.stampDetail = atob(x.transaction.stampDetail)
  // )
  // console.log(halfTrans)

  let STAMPS = halfTrans.filter((a) => {
    return a.transaction.fromAddress == req.params.pk;
  });

  STAMPS.map((x) => {
    x.transaction.stampDetail = atob(x.transaction.stampDetail);
  });
  console.log(STAMPS);

  res.status(200).json({
    status: 'success',

    data: {
      STAMPS,
    },
  });
});

exports.downloadStamp = catchAsync(async (req, res, next) => {
  const halfTrans = await HalfSignTrans.find({ status: 'Minted' });
  if (!halfTrans) {
    next(new appError('You Dont have any Transaction Yet', 404));
  }
  let STAMPS = halfTrans.filter((a) => {
    return a.id == req.params.id;
  });
  let stampDetails = atob(STAMPS[0].transaction.stampDetail).replace(
    /(<([^>]+)>)/gi,
    ' '
  );
  // const regex =
  //   /(\n|^)(Person's Name|Father Name|Cnic No|Description|Date|"I declare the oath that whatever I am going to write shall be the whole truth."|Seller's Signature|Buyer's Public Address|First Witness Public:|Address:|Second Witness:|Public Address:|Lawyer's Signature|Submit)/g;

  const regex =
    /(Person's Name:|Father Name:|Cnic No:|Description:|Issue Date:|(Second Party:Buyer)|"I declare the oath that whatever I am going to write shall be the whole truth."|Seller's Signature:|Buyer's Public Address:|First Witness Public:|Address:|Second Witness:|Public Address:|Lawyer's Signature:)/g;

  const a1 = [
    "Person's Name:",
    'Father Name:',
    'Cnic No:',
    'Description:',
    'Issue Date:',
    '(Second Party:Buyer)',
    'I declare the oath that whatever I am going to write shall be the whole truth.',
    "Seller's Signature:",
    "Buyer's Public Address",
    'First Witness Public Address:',
    'Second Witness Public Address:',
    "Lawyer's Signature",
  ];

  const doc = new PDFDocument();

  let i = [];
  for (let index = 0; index < a1.length; index++) {
    i.push(stampDetails.indexOf(a1[index]));
    // stampDetails[inedx].push('---------------');
  }
  i.sort((a, b) => a - b);
  let m = 0;
  let element = [];
  for (let index = 0; index < stampDetails.length; index++) {
    element = element + stampDetails[index];
    if (index + 3 >= i[m]) {
      if (index > i[11]) {
        element = element + STAMPS[0].transaction.LawyerPublic;
      } else if (index > i[10]) {
        element = element + STAMPS[0].transaction.v2publicKey;
      } else if (index > i[9]) {
        element = element + STAMPS[0].transaction.v1publicKey;
      } else if (index > i[8]) {
        element = element + STAMPS[0].transaction.toAddress;
      } else if (index > i[7]) {
        console.log('lawyer');
        element = element + STAMPS[0].transaction.fromAddress;
      }
      doc.text(element.toString());
      doc.moveDown();
      element = '';
      m++;
    }
    if (index > i[i.length - 1]) {
      if (index == stampDetails.length - 16) {
        element = element + STAMPS[0].transaction.LawyerPublic;
        doc.text(element.toString());
        console.log(element.toString());
        doc.moveDown();
        element = '';
      }
    }
  }

  const qrName = `QRcode/${req.params.id}.png`;
  QRCode.toFile(
    qrName,
    `http://localhost:3000/viewStamp/${req.params.id}`,
    (err) => {
      console.log(err);
      if (err) throw err;
    }
  );

  console.log('1');
  doc.image(`${qrName}`);
  // doc.image(`1.png`);
  // condoc.buffer
  console.log('2');

  // doc.pipe(fs.createWriteStream('example.pdf'));
  doc.end();
  console.log('3');

  res.setHeader('Content-disposition', `attachment; filename=Bilal.pdf`);

  console.log('4');
  res.setHeader('Content-type', 'application/pdf');

  console.log('5');
  // const filestream = fs.createReadStream(filePath);
  doc.pipe(res);

  // console.log(a1.length);

  // const outputString = stampDetails.includes("Person's Name")
  //   ? stampDetails.replace("Person's Name", '\n')

  // console.log(stampDetails.replace("Person's Name", "\n Person's Name"));

  // let outputString = stampDetails.replace(regex, '\n$1');

  // stampDetails = stampDetails.replace(
  //   /\n(?=Person's Name:|Father Name:|Cnic No:|Description:|Date:|"I declare the oath that whatever I am going to write shall be the whole truth."|Seller's Signature:|Buyer's Public Address:|First Witness Public: Address:|Second Witness:|Public Address:|Lawyer's Signature:|Submit)/g,
  //   '<br>'
  // );

  // console.log(outputString);

  // doc.fontSize(14).text(outputString);

  // create a write stream to save the PDF
  // const writeStream = fs.createWriteStream('AggrementStamp.pdf');

  // pipe the PDF document to the write stream
  // doc.pipe(writeStream);

  // end the document
  // doc.end();

  // writeStream.on('finish', () => {
  //   const filePath = `example1111.pdf`;
  //   const fileName = 'example1111.pdf';
  //   res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
  //   res.setHeader('Content-type', 'application/pdf');
  //   const filestream = fs.createReadStream(filePath);
  //   filestream.pipe(res);
  // });

  // res.status(200).json({
  //   status: 'success',

  //   messages: "PDF generated"
  // });
});

exports.getOneStamp = catchAsync(async (req, res, next) => {
  const halfTrans = await HalfSignTrans.find({ status: 'Minted' });
  if (!halfTrans) {
    next(new appError('You Dont have any Transaction Yet', 404));
  }
  let STAMPS = halfTrans.filter((a) => {
    return a.id == req.params.id;
  });

  STAMPS[0].transaction.stampDetail = atob(STAMPS[0].transaction.stampDetail);
  res.status(200).json({
    status: 'success',

    data: STAMPS[0].transaction,
  });
});
