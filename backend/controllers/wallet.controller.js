import * as userRepo from "../repositories/user.repository.js";
import * as walletService from "../services/wallet.history.service.js"



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

  res.json({ success: true, wallet });
};

export const getWallet = async (req, res) => {
  const userId = req.user.id;
  const wallet = await userRepo.getWallet(userId);
  res.json({ success: true, wallet });
};




export const getWalletHistory = async (req, res) => {
  try {
    const data = await walletService.getWalletHistoryWithWallet();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





export const searchWalletHistoryController = async (req, res) => {
  try {
    const { search } = req.query;

    const data = await walletService.searchWalletHistoryService(search);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};