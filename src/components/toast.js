const ToastShow = (type, message) => {
  if (type === "success") {
    toast.show(message, {
      type: type,
      placement: "bottom",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });
  }
  if (type === "warning") {
    toast.show(message, {
      type: type,
      placement: "bottom",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });
  }
  if (type === "danger") {
    toast.show(message, {
      type: type,
      placement: "bottom",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });
  }
  if (type === "normal") {
    toast.show(message, {
      type: type,
      placement: "bottom",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });
  }
};

export { ToastShow };
