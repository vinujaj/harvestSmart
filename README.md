# HarvestSmart: Real-Time Oil Palm Bunch Ripeness Detection on Mobile

![HarvestSmart Screenshot](https://github.com/user-attachments/assets/5dd54042-2905-4a33-a09e-507010836516)

---

## Overview

**HarvestSmart** is a mobile-based oil palm bunch ripeness classification and counting system optimized for real-time deployment in field conditions. Built using **YOLOv10** and enhanced with **Low-Rank Adaptation (LoRA)**, the model is designed to run efficiently on Android devices via **TensorFlow Lite** conversion.

---

## Features

- Detects and classifies oil palm bunch ripeness into: **Ripe**, **Underripe**, **Overripe**, **Abnormal**
- Bunch counting using object detection
- Real-time inference on mobile with TensorFlow Lite
- Low-rank fine-tuning via LoRA to minimize model size
- User-friendly mobile interface for farmers
- Daily PDF reports sent to collection centers via email

---

## Technologies Used

- **YOLOv10 (Ultralytics)**
- **Python + PyTorch** for model development
- **LoRA** (Low-Rank Adaptation) for parameter-efficient fine-tuning
- **TensorFlow Lite** for mobile deployment
- **React Native** for mobile app
- **Google Colab** (for training with GPU)
- **Flask** (for API backend)
- **Android Studio / VS Code**

---

## Dataset

- **Dataset Name**: *Palm Ripeness Detection*
- **Source**: Roboflow Universe
- **URL**: [Palm Ripeness Detection Dataset](https://universe.roboflow.com/tugas-akhir-pybma/palm-ripeness-detection)

---

## App Features

- Image upload from camera or gallery
- Real-time detection with visual feedback
- Harvest summary with ripeness distribution
- Report generation in PDF format
