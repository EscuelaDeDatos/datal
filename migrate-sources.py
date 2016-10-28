from core.models import *

for account in Account.objects.all():
    for source in Source.objects.filter(sourcedatastream__datastreamrevision__user__account_id=account.id, account__isnull=True).distinct():
        new_source = Source()
        new_source.name = source.name
        new_source.url = source.url
        new_source.account = account
        new_source.save()
        for sd in source.sourcedatastream_set.all():
            SourceDatastream.objects.create(source=new_source, datastreamrevision=sd.datastreamrevision)

for account in Account.objects.all():
    for source in Source.objects.filter(sourcedataset__datasetrevision__user__account_id=account.id, account__isnull=True).distinct():
        new_source = Source()
        new_source.name = source.name
        new_source.url = source.url
        new_source.account = account
        new_source.save()
        for sd in source.sourcedataset_set.all():
            SourceDataset.objects.create(source=new_source, datasetrevision=sd.datasetrevision)

Source.objects.filter(account__isnull=True).delete():

for source in Source.objects.all():
  for source2 in Source.objects.all():
    if source.id != source2.id and source.name == source2.name and source.account == source2.account:
      source2.delete()