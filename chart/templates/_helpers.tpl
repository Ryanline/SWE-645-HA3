{{/* Ryan Brooks: These helper templates generate consistent Helm resource names across the chart. */}}
{{- define "swe645-ha3.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "swe645-ha3.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s" (include "swe645-ha3.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
