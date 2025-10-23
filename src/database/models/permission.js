export default (sequelize, DataTypes) => {
  // Alias
  let alias = "Permission";
  
  // Columnas
  let cols = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    system: {
      type: DataTypes.STRING(255)
    },
    responsible: {
      type: DataTypes.TEXT
    },
    prefix: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Folder prefix within the R2 bucket (e.g., 'client1/', 'project-a/')"
    },
    apiKey: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  };
  
  // Configuración
  let config = {
    tableName: "permission",
    timestamps: true,
    schema: "file"
  };
  
  // Definir modelo
  const Permission = sequelize.define(alias, cols, config);
  
  // Asociaciones
  Permission.associate = function(models) {
    
  };
  
  return Permission;
};
