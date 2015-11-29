  route.all('/kale-records', {
    get: controllers.kaleRecords.index,
    post: controllers.kaleRecords.create
  });

  route.all('/kale-records/:id', {
    get: controllers.kaleRecords.show,
    put: controllers.kaleRecords.update,
    delete: controllers.kaleRecords.destroy
  });

