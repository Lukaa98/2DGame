using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundEffects : MonoBehaviour
{
   public AudioSource levelMusic;
   public AudioSource deathSong; 
      public AudioSource wonSong; 

   
   public bool levelSong = true;
   public bool DeathSong = false;
      public bool WonSong = false;

   


    public void LevelMusic()
    {
        levelSong = true;
        DeathSong = false;
        WonSong = false;
        levelMusic.Play();
    }

    public void DeathSound()
    {
        if(levelMusic.isPlaying)
        levelSong = false;
        {
            levelMusic.Stop();
        }
            if(!deathSong.isPlaying && DeathSong == false)
            {

                DeathSong = true;
                deathSong.Play();

            }
        }


        public void WonSound()
    {
        if(levelMusic.isPlaying)
        levelSong = false;
        {
            levelMusic.Stop();
        }
            if(!wonSong.isPlaying && WonSong == false)
            {

                WonSong = true;
                wonSong.Play();

            }
        }
    }


