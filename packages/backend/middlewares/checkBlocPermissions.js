const Bloc = require("../models/blocModel");
const Warehouse = require("../models/warehouseModel");

const checkBlocPermissions = async (req, res, next) => {
  try {
    const userId = req.user._id; // Récupération de l'utilisateur depuis le middleware d'auth
    const { blocId } = req.params; // ID du bloc à modifier ou supprimer

    // Récupérer le bloc concerné
    const bloc = await Bloc.findById(blocId).populate("warehouse");

    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }

    // Récupérer le warehouse associé
    const warehouse = await Warehouse.findById(bloc.warehouse).populate(
      "members.user"
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse non trouvé" });
    }

    // Vérifier si l'utilisateur est le créateur du warehouse
    if (warehouse.addedBy.toString() === userId.toString()) {
      return next();
    }

    // Vérifier si l'utilisateur est un membre avec le rôle "ADMIN" ou "MEMBER"
    const isAuthorized = warehouse.members.some(
      (member) =>
        member.user._id.toString() === userId.toString() &&
        (member.role === "ADMIN" || member.role === "MEMBER")
    );

    if (!isAuthorized) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    next();
  } catch (error) {
    console.error("Erreur de permission:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { checkBlocPermissions };
