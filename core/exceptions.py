import json
from core.choices import StatusChoices

class DATALException(Exception):
    """DATAL Exception class: Base class for handling exceptions."""
    title = 'DATAL Error'

    def __init__(self, title=None, description='', status_code=400, extras={}):
        if title:
            self.title = title
        self.description = description
        self.status_code = status_code
        self.extras = extras
        message = '%s. %s' % (self.title, self.description)
        super(DATALException, self).__init__(message)

    def __str__(self):
        return '%s: %s' % (self.title, self.description)

    def as_dict(self):
        return {"error": self.title, "message": self.description, "extras": self.extras, "status_code": self.status_code}

    def convert_json(self):
        return json.dumps(self.as_dict())


class ApplicationException(DATALException):
    title = 'Application error'


class LifeCycleException(ApplicationException):
    title = 'Life cycle error'

class DatastoreNotFoundException(ApplicationException):
    title = 'Data Store not found'

class MailServiceNotFoundException(ApplicationException):
    title = 'Mail service not found'

class SearchIndexNotFoundException(ApplicationException):
    title = 'Search index not found exception'


class DatasetNotFoundException(LifeCycleException):
    title = 'Dataset not found'

    def __init__(self, description=''):
        super(DatasetNotFoundException, self).__init__(description=description, status_code=404)


class DataStreamNotFoundException(LifeCycleException):
    title = 'Datastream not found'


class VisualizationRequiredException(LifeCycleException):
    title = 'Visualization not found'


class ChildNotApprovedException(LifeCycleException):
    title = 'Child not approved'

    def __init__(self, failed_revisions, description=''):
        self.extras = dict(failed_revisions=failed_revisions)
        super(ChildNotApprovedException, self).__init__(description)


class IlegalStateException(LifeCycleException):
    title = 'Ilegal state'

    def __init__(self, allowed_states, description=''):
        self.extras = {"allowed_states": allowed_states}
        super(IlegalStateException, self).__init__(description)


class ParentNotPublishedException(LifeCycleException):
    title = 'Parent not published'

    def __init__(self, description='Parent resource must be published'):
        super(ParentNotPublishedException, self).__init__(description)

class S3CreateException(DATALException):
    title = 'S3 Create error'

    def __init__(self, description):
        super(S3CreateException, self).__init__(description=description, status_code=503)


class S3UpdateException(DATALException):
    title = 'S3 Update error'

    def __init__(self, description):
        super(S3UpdateException, self).__init__(description=description, status_code=503)


class SFTPCreateException(DATALException):
    title = 'SFTP Create error'

    def __init__(self, description):
        super(SFTPCreateException, self).__init__(description=description, status_code=503)


class SFTPUpdateException(DATALException):
    title = 'SFTP Update error'

    def __init__(self, description):
        super(SFTPUpdateException, self).__init__(description=description, status_code=503)