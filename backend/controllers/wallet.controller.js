import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import * as userRepo from "../repositories/user.repository.js";
import * as walletService from "../services/wallet.history.service.js"
import * as walletServi from "../services/wallet.service.js"
import { generateExcel } from "../utils/excel.helper.js";
import { generatePDF } from "../utils/pdf.helper.js";



// export const getWalletHistory = async (req, res) => {
//   const history = await walletHistoryRepo.getHistoryByUser(req.user.id);

//   res.status(200).json({
//     success: true,
//     history,
//   });
// };


export const addMoney = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;
  const wallet = await userRepo.addMoneyToWallet(userId, amount);

  res.status(HTTP_STATUS.OK).json({ success: true, wallet });
};

export const getWallet = async (req, res) => {
  const userId = req.user.id;
  const wallet = await userRepo.getWallet(userId);
  res.status(HTTP_STATUS.OK).json({ success: true, wallet });
};




export const getWalletHistory = async (req, res) => {
  try {
    const data = await walletService.getWalletHistoryWithWallet();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};





export const searchWalletHistoryController = async (req, res) => {
  try {
    const { search } = req.query;

    const data = await walletService.searchWalletHistoryService(search);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


export const filterWalletPending = async (req, res) => {
  try {
    const { type, amount } = req.query;

    const result = await walletServi.getWalletByPendingFilter(type, amount);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


export const downloadWalletHistory = async (req, res) => {
  try {
    const { format = "pdf" } = req.query;

    const walletData = await walletService.getWalletHistoryWithWallet();

    if (!walletData || walletData.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.WALLET.HISTORY,
      });
    }

    const formattedData = walletData.map((item) => ({
      "Employee Id": item.email,
      Name: item.name,
      "Pending Bill": item.payment,       
      Wallet: item.walletBalance || 0,
    }));

    let filePath;
    if (format === "excel") {
      filePath = await generateExcel("wallet-history", "all", formattedData);
    } else {
      filePath = await generatePDF("wallet-history", "all", formattedData);
    }

    return res.download(filePath);

  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};